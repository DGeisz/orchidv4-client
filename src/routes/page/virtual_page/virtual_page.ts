import {
    is_dec_append,
    is_dec_delete,
    is_dec_insert,
    is_dec_socket_res,
    is_dec_update,
    is_error_invalid_tds,
    is_error_res,
    is_full_page,
    is_td_socket_res,
    is_td_update,
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
import { hint_strings } from "../../../global_utils/vimium_hints";
import {
    element_in_bottom,
    element_in_top,
    element_in_view,
} from "../utils/dom_utils";

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

    private controller_paused: boolean = false;

    private window_in_focus: boolean = true;

    private dec_sockets: VDecSocket[] = [];
    private cursor?: VSocket;
    private cursor_interval?: NodeJS.Timer;

    private select_mode: boolean = false;
    private set_external_select_mode: (select_mode: boolean) => void;

    private select_seq: string = "";
    private set_external_select_seq: (seq: string) => void;

    constructor(
        id: string,
        set_reduced_forms: (reduced_forms: ReducedFormType[]) => void,
        set_external_select_mode: (select_mode: boolean) => void,
        set_external_select_seq: (seq: string) => void
    ) {
        this.id = id;
        this.set_reduced_forms = set_reduced_forms;
        this.set_external_select_mode = set_external_select_mode;
        this.set_external_select_seq = set_external_select_seq;

        this.set_listeners();
    }

    process_change = () => {
        if (!!this.cursor) {
            const new_cursor = this.cursor.check_cursor();
            if (!!new_cursor) {
                this.cursor = new_cursor;
            }
        }

        /* If we're in select mode, be sure
         * to set the labels before we get reduced form */

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

                    if (!!socket) {
                        socket.update(dec_socket_ser);

                        const move_result = socket.move_cursor_next();

                        if (move_result.tag === CursorResponseTag.MoveSocket) {
                            this.cursor = move_result.new_socket;
                        }
                    }
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
                            this.dec_sockets.splice(r_index, 0, new_socket);
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

        if (is_td_socket_res(res)) {
            const { page_id, res: td_res } = res.TermDefSocket;
            console.log("This is res 2", res);

            if (page_id === this.id) {
                console.log("This is res 3", res);
                if (is_td_update(td_res)) {
                    console.log("This is res 4", res);
                    const ser = td_res.Update.term_def_socket_ser;

                    const tds = this.get_term_def_socket(ser.id);

                    if (!!tds) {
                        this.cursor = tds.update(ser);
                    }
                }

                this.process_change();
            }
        }

        if (is_error_res(res)) {
            const error_res = res.Error;

            if (is_error_invalid_tds(error_res)) {
                const { page_id, socket_id } = error_res.InvalidTdsInput;

                if (page_id === this.id) {
                    const tds = this.get_term_def_socket(socket_id);

                    if (!!tds) {
                        tds.flag_invalid();

                        this.process_change();
                    }
                }
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

    set_select_mode = (select_mode: boolean) => {
        this.select_mode = select_mode;
        this.set_external_select_mode(select_mode);
    };

    set_select_seq = (select_seq: string) => {
        this.select_seq = select_seq;
        this.set_external_select_seq(select_seq);
    };

    set_listeners = () => {
        document.addEventListener("keypress", (e) => {
            if (!this.controller_paused) {
                const char = e.key.trim();

                console.log("Here's the char: ", e);
                if (
                    char.length === 1 &&
                    (/^[a-z0-9]+$/i.test(char) ||
                        ALLOWED_NON_ALPHA_NUMERIC_CHARS.includes(char))
                ) {
                    if (this.select_mode) {
                        this.set_select_seq(this.select_seq + char);
                    } else {
                        console.log("In here now...", !!this.cursor);
                        !!this.cursor && this.cursor.insert_char(char);
                    }

                    this.process_change();
                }
            }
        });

        document.addEventListener("keydown", (e) => {
            if (this.controller_paused) {
                e.preventDefault();
            } else {
                if (
                    [
                        "Backspace",
                        // "ArrowDown",
                        // "ArrowUp",
                        "ArrowLeft",
                        "ArrowRight",
                        "Enter",
                    ].indexOf(e.key) > -1
                ) {
                    e.preventDefault();
                }

                const fraction = 1 / 3;

                let cursor_in_top_fraction = false;
                let cursor_in_bottom_fraction = false;

                const cursor = document.getElementById(CURSOR_NAME);

                if (!!cursor) {
                    if (element_in_top(cursor, fraction)) {
                        cursor_in_top_fraction = true;
                    }

                    if (element_in_bottom(cursor, fraction)) {
                        cursor_in_bottom_fraction = true;
                    }
                }

                if (this.select_mode) {
                    const switch_out = () => {
                        this.set_select_seq("");
                        this.set_select_mode(false);
                    };

                    switch (e.key) {
                        case "Escape": {
                            switch_out();
                            break;
                        }
                        case "Backspace": {
                            if (this.select_seq.length > 0) {
                                this.set_select_seq(
                                    this.select_seq.substring(
                                        0,
                                        this.select_seq.length - 1
                                    )
                                );
                            } else {
                                switch_out();
                                break;
                            }
                        }
                    }
                } else {
                    if (e.ctrlKey && !e.shiftKey) {
                        switch (e.key) {
                            case "Control":
                                e.preventDefault();
                                return;
                            case "f":
                                e.preventDefault();
                                this.set_select_mode(true);
                                this.set_select_seq("");
                                break;
                            case "j":
                                e.preventDefault();
                                this.controller_paused = true;

                                setTimeout(() => {
                                    this.controller_paused = false;
                                }, 200);

                                window.scrollBy(0, 400);
                                return;
                            case "k":
                                e.preventDefault();
                                this.controller_paused = true;

                                setTimeout(() => {
                                    this.controller_paused = false;
                                }, 200);

                                window.scrollBy(0, -400);
                                return;
                        }
                    } else if (!!this.cursor) {
                        switch (e.key) {
                            case "Backspace": {
                                this.cursor.delete(this.id);
                                break;
                            }
                            case "ArrowLeft": {
                                const response =
                                    this.cursor.move_cursor_previous();

                                if (
                                    response.tag ===
                                    CursorResponseTag.MoveSocket
                                ) {
                                    this.cursor = response.new_socket;
                                }

                                break;
                            }
                            case "ArrowUp": {
                                if (!cursor_in_top_fraction) {
                                    e.preventDefault();
                                }

                                const response =
                                    this.cursor.move_cursor_previous();

                                if (
                                    response.tag ===
                                    CursorResponseTag.MoveSocket
                                ) {
                                    this.cursor = response.new_socket;
                                }

                                break;
                            }
                            case "ArrowRight": {
                                const response = this.cursor.move_cursor_next();

                                if (
                                    response.tag ===
                                    CursorResponseTag.MoveSocket
                                ) {
                                    this.cursor = response.new_socket;
                                }

                                break;
                            }
                            case "ArrowDown": {
                                if (!cursor_in_bottom_fraction) {
                                    e.preventDefault();
                                }

                                const response = this.cursor.move_cursor_next();

                                if (
                                    response.tag ===
                                    CursorResponseTag.MoveSocket
                                ) {
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
                }

                this.process_change();
            }
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

    select_socket = (socket_id: string) => {
        const result = this.get_socket(socket_id);

        if (!!result) {
            this.set_select_seq("");
            this.set_select_mode(false);

            this.cursor = result.activate_left_cursor(true);
            this.process_change();
        }
    };

    /* The following methods are required for v_sockets */
    get_reduced_form: () => ReducedFormType[] = () => {
        /* If the window isn't in focus, we don't want the
         * cursor to show up */
        let active_socket_id = "";

        if (this.window_in_focus && !this.select_mode && !!this.cursor) {
            active_socket_id = this.cursor.get_id();
        }

        this.label_sockets();

        return this.dec_sockets.map((dec_socket) =>
            dec_socket.get_reduced_form(active_socket_id)
        );
    };

    get_id = () => this.id;

    get_socket = (socket_id: string) => {
        for (let socket of this.dec_sockets) {
            const result = socket.get_socket(socket_id);

            if (!!result) {
                return result;
            }
        }

        return null;
    };

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

    num_selectable_sockets = () => {
        let total = 0;

        for (let socket of this.dec_sockets) {
            total += socket.num_selectable_sockets();
        }

        return total;
    };

    label_selectable_sockets = (labels: string[]) => {
        for (let socket of this.dec_sockets) {
            labels = socket.label_selectable_sockets(labels);
        }

        return labels;
    };

    label_sockets = () => {
        const num_selectable = this.num_selectable_sockets();
        const labels = hint_strings(num_selectable).reverse();
        this.label_selectable_sockets(labels);
    };

    fill_term_def_socket = (tds_id: string, term_seq: string) => {
        kernel_link.fill_term_def_socket(this.id, tds_id, term_seq);
    };

    get_term_def_socket = (socket_id: string) => {
        for (let dec_socket of this.dec_sockets) {
            const tds = dec_socket.get_term_def_socket(socket_id);

            if (!!tds) {
                return tds;
            }
        }

        return null;
    };

    get_expr_socket = (socket_id: string) => {
        for (let dec_socket of this.dec_sockets) {
            const ex = dec_socket.get_expr_socket(socket_id);

            if (!!ex) {
                return ex;
            }
        }

        return null;
    };
}
