import { VLex } from "./v_lex";

export enum CursorResponseTag {
    Success,
    MoveSocket,
}

interface CursorSuccess {
    tag: CursorResponseTag.Success;
}

export function cursor_success(): CursorResponse {
    return {
        tag: CursorResponseTag.Success,
    };
}

interface CursorMoved {
    tag: CursorResponseTag.MoveSocket;
    new_socket: VSocket;
}

export function cursor_moved(new_socket: VSocket): CursorResponse {
    return {
        tag: CursorResponseTag.MoveSocket,
        new_socket,
    };
}

export type CursorResponse = CursorMoved | CursorSuccess;

export enum CursorSide {
    Left,
    Right,
}

export interface VSocket extends VLex {
    get_id: () => string;
    /*`from_left` determines which direction the cursor came from */
    activate_left_cursor: (from_left: boolean) => VSocket;
    activate_right_cursor: (from_left: boolean) => VSocket;
    insert_char: (char: string) => void;
    delete: () => void;
    move_cursor_next: () => CursorResponse;
    move_cursor_previous: () => CursorResponse;
}