import { is_full_page, WsResponse } from "../../../kernel_link/ws_response";
import { VDecSocket } from "./v_lexicon/v_declaration/v_dec_socket";
import { cursor_success, VSocket } from "./v_lexicon/v_socket";
import { ReducedFormType } from "../page_types/reduced_form/reduced_form";

export const CURSOR_NAME = "cursor";
export const CURSOR_LATEX: string =
    "\\cssId{cursor}{\\color{black}{\\boldsymbol{|}}}";

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
        this.set_reduced_forms(this.get_reduced_form());
        this.restart_cursor();
    };

    process_response = (res: WsResponse) => {
        if (!this.cursor && this.dec_sockets.length > 0) {
            this.cursor = this.dec_sockets[0].activate_left_cursor(true);
        }

        if (is_full_page(res)) {
            const page = res.FullPage.page;

            /* First make sure that this is even the right page */
            if (page.id === this.id) {
                /* Now, initialize the dec sockets */
                this.dec_sockets = page.dec_sockets.map(
                    (dec) => new VDecSocket(dec, this)
                );

                /* Let the first dec socket be the current cursor
                 * if the current cursor isn't defined */
                if (!this.cursor) {
                    this.cursor =
                        this.dec_sockets[0].activate_left_cursor(true);
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

            if (char.length === 1) {
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
                        this.cursor.move_cursor_previous();
                        break;
                    }
                    case "ArrowRight": {
                        this.cursor.move_cursor_next();
                        break;
                    }
                }
            }

            this.process_change();
        });

        window.addEventListener("focus", () => {
            this.window_in_focus = true;
            this.process_change();
        });

        window.addEventListener("blur", () => {
            this.window_in_focus = false;
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
}
