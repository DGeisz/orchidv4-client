import React, { ReactNode, useContext, useEffect, useState } from "react";
import {
    createCursorNextEvent,
    createCursorPreviousEvent,
    createKeyEnteredEvent,
    SocketEvent,
    SocketEventTag,
} from "./socket_events";

/**
 * Namely, whether the cursor is on the left side
 * or the right side of the child
 */
enum CursorPosition {
    Left,
    Right,
}

interface Cursor {
    socket_id: string;
    position: CursorPosition;
}

interface SocketControlType {
    cmd_callbacks: Map<string, (cmd: SocketEvent) => void>;
    add_cmd_callback: (
        id: string,
        on_event: (cmd: SocketEvent) => void
    ) => void;
    remove_cmd_callback: (id: string) => void;
    socket_cursor: Cursor;
    set_socket_cursor: (cursor: Cursor) => void;
    send_event_to_socket: (event: SocketEvent, socket_id: string) => void;
}

const SocketControlContext = React.createContext<SocketControlType>({
    cmd_callbacks: new Map<string, (cmd: SocketEvent) => void>(),
    add_cmd_callback: () => {},
    remove_cmd_callback: () => {},
    set_socket_cursor: () => {},
    socket_cursor: {
        socket_id: "",
        position: CursorPosition.Left,
    },
    send_event_to_socket: () => {},
});

export function withSocketCmd(node: ReactNode): ReactNode {
    return () => {
        const [socket_cursor, set_socket_cursor] = useState<Cursor>({
            socket_id: "",
            position: CursorPosition.Left,
        });

        const [cmd_callbacks, set_cmd_callbacks] = useState<
            Map<string, (cmd: SocketEvent) => void>
        >(new Map());

        const add_cmd_callback = (
            id: string,
            on_event: (cmd: SocketEvent) => void
        ) => {
            const new_callbacks = { ...cmd_callbacks };
            new_callbacks.set(id, on_event);

            set_cmd_callbacks(new_callbacks);
        };

        const remove_cmd_callback = (id: string) => {
            const new_callbacks = { ...cmd_callbacks };
            new_callbacks.delete(id);

            set_cmd_callbacks(new_callbacks);
        };

        const send_event_to_socket = (
            event: SocketEvent,
            socket_id: string
        ) => {
            const callback = cmd_callbacks.get(socket_id);

            !!callback && callback(event);
        };

        return (
            <SocketControlContext.Provider
                value={{
                    cmd_callbacks,
                    add_cmd_callback,
                    remove_cmd_callback,
                    socket_cursor,
                    set_socket_cursor,
                    send_event_to_socket,
                }}
            >
                {node}
            </SocketControlContext.Provider>
        );
    };
}

interface SocketControllerType {
    socket_cursor: Cursor;
    send_event_to_socket: (event: SocketEvent, socket_id: string) => void;
}

export function useSocketMaster(): SocketControllerType {
    const { send_event_to_socket, socket_cursor } =
        useContext(SocketControlContext);

    /*
     * Bake the document listeners
     * directly into useSocketMaster
     */
    useEffect(() => {
        const onKeypress = (e: KeyboardEvent) => {
            const char = e.key.trim();

            send_event_to_socket(
                createKeyEnteredEvent(char),
                socket_cursor.socket_id
            );
        };

        document.addEventListener("keypress", onKeypress);

        return () => {
            document.removeEventListener("keypress", onKeypress);
        };
    }, [socket_cursor]);

    return { send_event_to_socket, socket_cursor };
}

interface SocketSlaveType {
    socket_cursor: Cursor;
    set_socket_cursor: (cursor: Cursor) => void;
    move_cursor_next: () => void;
    move_cursor_previous: () => void;
}

export function useSocketSlave(
    id: string,
    parent_id: string,
    child_ids: string[],
    on_event: (cmd: SocketEvent) => void
): SocketSlaveType {
    const {
        add_cmd_callback,
        remove_cmd_callback,
        socket_cursor,
        set_socket_cursor,
        cmd_callbacks,
    } = useContext(SocketControlContext);

    const move_cursor_previous = () => {
        const callback = cmd_callbacks.get(parent_id);

        !!callback && callback(createCursorPreviousEvent(id));
    };

    const move_cursor_next = () => {
        const callback = cmd_callbacks.get(parent_id);

        !!callback && callback(createCursorNextEvent(id));
    };

    useEffect(() => {
        const callback = (event: SocketEvent) => {
            switch (event.tag) {
                case SocketEventTag.CursorPrevious: {
                    const child_id = event.caller_id;
                    const index = child_ids.indexOf(child_id);

                    /*
                     * First condition handles the case where
                     * this comes from left-most child, and case
                     * where it doesn't come from one of my children
                     */
                    if (index < 1) {
                        set_socket_cursor({
                            socket_id: id,
                            position: CursorPosition.Left,
                        });
                    } else {
                        /*
                         * Otherwise, move the cursor
                         * to the previous child
                         */
                        set_socket_cursor({
                            socket_id: child_ids[index - 1],
                            position: CursorPosition.Right,
                        });
                    }
                    break;
                }
                case SocketEventTag.CursorNext: {
                    const child_id = event.caller_id;
                    const index = child_ids.indexOf(child_id);

                    /*
                     * First condition handles the case where
                     * this comes from right-most child, and case
                     * where it doesn't come from one of my children
                     */
                    if (index < 0 || index >= child_ids.length - 1) {
                        set_socket_cursor({
                            socket_id: id,
                            position: CursorPosition.Right,
                        });
                    } else {
                        /*
                         * Otherwise, move the cursor
                         * to the previous child
                         */
                        set_socket_cursor({
                            socket_id: child_ids[index + 1],
                            position: CursorPosition.Left,
                        });
                    }
                    break;
                }
                default: {
                    on_event(event);
                }
            }
        };

        add_cmd_callback(id, callback);

        return () => remove_cmd_callback(id);
    }, [child_ids]);

    return {
        socket_cursor,
        set_socket_cursor,
        move_cursor_next,
        move_cursor_previous,
    };
}
