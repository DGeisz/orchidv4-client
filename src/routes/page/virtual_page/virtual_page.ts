import {
    is_dec_append,
    is_dec_delete,
    is_dec_insert,
    is_dec_socket_res,
    is_dec_update,
    is_full_page,
    WsResponse,
} from "../../../kernel_link/ws_response";
import { VDecSocket } from "./v_lexicon/v_declaration/v_dec_socket";
import {
    cursor_success,
    CursorResponseTag,
    VSocket,
} from "./v_lexicon/v_socket";
import { ReducedFormType } from "../page_types/reduced_form/reduced_form";
import {
    ALLOWED_NON_ALPHA_NUMERIC_CHARS,
    CURSOR_NAME,
} from "../utils/latex_utils";
import { kernel_link } from "../../../kernel_link/kernel_link";

/* This is just for debugging purposes.
 * If set to false, the cursor keeps blinking
 * after another window is activated */
const BLUR_ON_LEAVE: boolean = true;

/**
 * The virtual page intakes commands from the kernel link
 * and uses these commands to assemble a "editor representation"
 * of the page.  Namely, an unfinished command can be stored
 * in the virtual page prior to being committed to the kernel
 * for type checking.  The virtual page then sends a processed
 * view skeleton of the page to the react component tree for
 * final processing.
 *
 * In all sub files of this directly, a prefix of "V" or "v_"
 * means "virtual"
 */
export class VirtualPage implements VSocket {
    private readonly id: string;
    private readonly set_reduced_forms: (
        reduced_forms: ReducedFormType[]
    ) => void;

    private window_in_focus: boolean = true;

    private dec_sockets: VDecSocket[] = [];
    private cursor?: VSocket;
    private cursor_interval?: NodeJS.Timer;

    constructor(
        id: string,
        set_reduced_forms: (reduced_forms: ReducedFormType[]) => void
    ) {
        this.id = id;
        this.set_reduced_forms = set_reduced_forms;

        this.set_listeners();
    }

    process_change = () => {
        if (!!this.cursor) {
            const new_cursor = this.cursor.check_cursor();
            if (!!new_cursor) {
                this.cursor = new_cursor;
            }
        }

        this.set_reduced_forms(this.get_reduced_form());
        this.restart_cursor();
    };

    process_response = (res: WsResponse) => {
        if (!this.cursor && this.dec_sockets.length > 0) {
            this.cursor = this.dec_sockets[0].activate_left_cursor(true);
        }

        console.log(res);

        if (is_full_page(res)) {
            const page = res.FullPage.page;

            /* First make sure that this is even the right page */
            if (page.id === this.id) {
                /* Now, initialize the dec sockets */
                this.dec_sockets = page.dec_sockets.map(
                    (dec) => new VDecSocket(dec, this)
                );

                if (!this.cursor && this.dec_sockets.length > 0) {
                    this.cursor =
                        this.dec_sockets[0].activate_left_cursor(true);
                }

                this.process_change();
            }
        }

        if (is_dec_socket_res(res)) {
            const { page_id, res: dec_res } = res.DecSocket;

            /* Make sure this is the right page */
            if (page_id === this.id) {
                /* Match on update*/
                if (is_dec_update(dec_res)) {
                    const { dec_socket_ser } = dec_res.Update;

                    const socket = this.dec_sockets.find(
                        (socket) => socket.get_id() === dec_socket_ser.id
                    );

                    !!socket && socket.update(dec_socket_ser);
                } else if (is_dec_append(dec_res)) {
                    /* Match on append */
                    const { dec_socket_ser } = dec_res.Append;

                    this.dec_sockets.push(new VDecSocket(dec_socket_ser, this));

                    this.cursor =
                        this.dec_sockets[
                            this.dec_sockets.length - 1
                        ].activate_left_cursor(true);
                } else if (is_dec_insert(dec_res)) {
                    /* Match on insert */
                    const { dec_socket_ser, rel_socket_id, before_rel } =
                        dec_res.Insert;

                    /* Get the index of the rel socket */
                    const r_index = this.dec_sockets.findIndex(
                        (socket) => socket.get_id() === rel_socket_id
                    );

                    if (r_index >= 0) {
                        const new_socket = new VDecSocket(dec_socket_ser, this);

                        if (before_rel) {
                            if (r_index > 0) {
                                this.dec_sockets.splice(r_index, 0, new_socket);
                            }
                        } else {
                            this.dec_sockets.splice(r_index + 1, 0, new_socket);

                            this.cursor = new_socket.activate_left_cursor(true);
                        }
                    }
                } else if (is_dec_delete(dec_res)) {
                    const { dec_socket_id } = dec_res.Delete;

                    /* Get index of appropriate socket*/
                    const s_index = this.dec_sockets.findIndex(
                        (socket) => socket.get_id() === dec_socket_id
                    );

                    if (s_index >= 0) {
                        /* Figure out where the cursor should go */
                        if (s_index === 0) {
                            if (this.dec_sockets.length === 1) {
                                /* If there's only one dec socket, there's
                                 * no where for the cursor to go once it's been
                                 * deleted */
                                this.cursor = undefined;
                            } else {
                                this.cursor =
                                    this.dec_sockets[1].activate_left_cursor(
                                        true
                                    );
                            }
                        } else {
                            /* Set cursor to the dec socket previous to this socket */
                            this.cursor =
                                this.dec_sockets[
                                    s_index - 1
                                ].activate_right_cursor(false);
                        }

                        /* Now get rid of this bad boi */
                        this.dec_sockets.splice(s_index, 1);
                    }
                }

                this.process_change();
            }
        }
    };

    /* The following methods pertain to page interaction */
    restart_cursor = () => {
        !!this.cursor_interval && clearInterval(this.cursor_interval);
        const cursor_obj = document.getElementById(CURSOR_NAME);

        if (!!cursor_obj) {
            cursor_obj.style.visibility = "visible";
        }

        this.cursor_interval = setInterval(() => {
            const cursor_obj = document.getElementById(CURSOR_NAME);

            if (!!cursor_obj) {
                cursor_obj.style.visibility =
                    cursor_obj.style.visibility === "hidden"
                        ? "visible"
                        : "hidden";
            }
        }, 530);
    };

    set_listeners = () => {
        document.addEventListener("keypress", (e) => {
            const char = e.key.trim();

            if (
                char.length === 1 &&
                (/^[a-z0-9]+$/i.test(char) ||
                    ALLOWED_NON_ALPHA_NUMERIC_CHARS.includes(char))
            ) {
                !!this.cursor && this.cursor.insert_char(char);
            }

            this.process_change();
        });

        document.addEventListener("keydown", (e) => {
            if (
                [
                    "Backspace",
                    "ArrowDown",
                    "ArrowUp",
                    "ArrowLeft",
                    "ArrowRight",
                    "Enter",
                ].indexOf(e.key) > -1
            ) {
                e.preventDefault();
            }

            if (!!this.cursor) {
                switch (e.key) {
                    case "Backspace": {
                        this.cursor.delete();
                        break;
                    }
                    case "ArrowLeft": {
                        const response = this.cursor.move_cursor_previous();

                        if (response.tag === CursorResponseTag.MoveSocket) {
                            this.cursor = response.new_socket;
                        }

                        break;
                    }
                    case "ArrowRight": {
                        const response = this.cursor.move_cursor_next();

                        if (response.tag === CursorResponseTag.MoveSocket) {
                            this.cursor = response.new_socket;
                        }

                        break;
                    }
                    case "Enter": {
                        this.cursor.commit_seq(this.id);
                        break;
                    }
                    case "Tab": {
                        this.cursor.commit_seq(this.id);
                        break;
                    }
                    case " ": {
                        this.cursor.commit_seq(this.id);
                        break;
                    }
                }
            }

            this.process_change();
        });

        window.addEventListener("focus", () => {
            if (BLUR_ON_LEAVE) {
                this.window_in_focus = true;
            }

            this.process_change();
        });

        window.addEventListener("blur", () => {
            if (BLUR_ON_LEAVE) {
                this.window_in_focus = false;
            }

            this.process_change();
        });
    };

    /* The following methods are required for v_sockets */
    get_reduced_form: () => ReducedFormType[] = () => {
        /* If the window isn't in focus, we don't want the
         * cursor to show up */
        const active_socket_id = this.window_in_focus
            ? !!this.cursor
                ? this.cursor.get_id()
                : ""
            : "";

        return this.dec_sockets.map((dec_socket) =>
            dec_socket.get_reduced_form(active_socket_id)
        );
    };

    get_id = () => this.id;

    activate_left_cursor = () => {
        return this.dec_sockets[0].activate_left_cursor(true);
    };

    activate_right_cursor = () => {
        return this.dec_sockets[
            this.dec_sockets.length - 1
        ].activate_right_cursor(false);
    };

    insert_char = () => {};
    delete = () => {};

    move_cursor_next = () => cursor_success();
    move_cursor_previous = () => cursor_success();

    get_child_sockets = () => this.dec_sockets;
    commit_seq = () => {};
    check_cursor = () => null;

    contains_id = (id: string) => {
        if (this.id === id) {
            return true;
        } else {
            return this.get_child_sockets().some((socket) =>
                socket.contains_id(id)
            );
        }
    };

    delete_dec_socket = (socket_id: string) => {
        kernel_link.delete_dec_socket(this.id, socket_id);
    };

    insert_dec_socket = (rel_socket_id: string, before_rel: boolean) => {
        kernel_link.insert_dec_socket(this.id, rel_socket_id, before_rel);
    };

    delete_dec_socket_contents = (socket_id: string) => {
        kernel_link.delete_dec_socket_contents(this.id, socket_id);
    };
}
