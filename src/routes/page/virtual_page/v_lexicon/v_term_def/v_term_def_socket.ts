import {
    cursor_moved,
    cursor_success,
    CursorResponseTag,
    CursorSide,
    VSocket,
} from "../v_socket";
import { TermDefSocketSer } from "../../../page_types/page_serde/lexicon/term_def/term_def_serialization";
import {
    ReducedFormTag,
    ReducedFormType,
} from "../../../page_types/reduced_form/reduced_form";
import {
    active_socket_tex,
    add_color_box,
    add_latex_color,
    create_tex_text,
    LATEX_EMPTY_SOCKET,
    LATEX_SPACE,
    text_with_cursor,
    wrap_html_id,
} from "../../../utils/latex_utils";
import { is_some } from "../../../page_types/page_serde/utils/rust_option";
import { palette } from "../../../../../global_styles/palette";
import { kernel_link } from "../../../../../kernel_link/kernel_link";
import { LabelBarge } from "../v_lex";

export class VTermDefSocket implements VSocket {
    private readonly id: string;
    private readonly parent_socket: VSocket;
    private seq_label: string = "";
    private term_seq?: string;
    private representation?: string;
    private is_entry_invalid: boolean = false;

    private rand: number;

    /*
     * Next fields are for cursor position
     */
    private cursor_side: CursorSide = CursorSide.Left;
    private left_entry_value: string = "";
    private right_entry_value: string = "";
    private cursor_position: number = 0;

    /* For priming delete */
    private delete_prime_count: number = 0;

    constructor(term_def_socket_ser: TermDefSocketSer, parent_socket: VSocket) {
        this.rand = Math.random();

        const { id, term_seq, representation } = term_def_socket_ser;
        this.id = id;
        this.parent_socket = parent_socket;

        if (is_some(term_seq) && is_some(representation)) {
            this.term_seq = term_seq;
            this.representation = representation;
        }
    }

    update = (term_def_socket_ser: TermDefSocketSer) => {
        const { id, term_seq, representation } = term_def_socket_ser;

        if (this.id === id) {
            /* First reset editor fields */
            this.left_entry_value = "";
            this.right_entry_value = "";
            this.cursor_side = CursorSide.Right;
            this.cursor_position = 0;

            if (is_some(term_seq) && is_some(representation)) {
                /* In this case, we're clearly filling socket */
                this.term_seq = term_seq;
                this.representation = representation;

                /* So we want to return the next socket that comes
                 * after this one */

                const c_result = this.move_cursor_next();

                switch (c_result.tag) {
                    case CursorResponseTag.MoveSocket:
                        return c_result.new_socket;
                    case CursorResponseTag.Success:
                        return this;
                }
            } else {
                /* In this case, the socket is empty */
                this.term_seq = undefined;
                this.representation = undefined;

                /* So we just return ourself */
                return this;
            }
        }
    };

    get_id = () => this.id;

    get_reduced_form: (cursor_socket_id: string) => ReducedFormType = (
        cursor_socket_id: string
    ) => {
        if (this.delete_prime_count > 0) {
            this.delete_prime_count--;
        }

        let is_invalid = false;

        if (this.is_entry_invalid) {
            /* First clear this out so this doesn't show up on the next render */
            this.is_entry_invalid = false;
            /* Then set the local is_invalid to make note that we should flag
             * invalid this time around */
            is_invalid = true;
        }

        if (!!this.term_seq && !!this.representation) {
            if (cursor_socket_id === this.id) {
                const bg_color =
                    this.delete_prime_count > 0
                        ? palette.danger_hover
                        : palette.socket_active_blue;

                switch (this.cursor_side) {
                    case CursorSide.Left:
                        return {
                            tag: ReducedFormTag.TexLine,
                            tex: add_color_box(
                                text_with_cursor(
                                    this.left_entry_value,
                                    this.cursor_position
                                ) +
                                    LATEX_SPACE +
                                    this.representation,
                                bg_color
                            ),
                            tex_widget_properties: [
                                {
                                    id: this.id,
                                    label: this.seq_label,
                                    term_seq: this.term_seq,
                                    term_representation: this.representation,
                                },
                            ],
                        };
                    case CursorSide.Right:
                        return {
                            tag: ReducedFormTag.TexLine,
                            tex: add_color_box(
                                this.representation +
                                    LATEX_SPACE +
                                    text_with_cursor(
                                        this.right_entry_value,
                                        this.cursor_position
                                    ),
                                bg_color
                            ),
                            tex_widget_properties: [
                                {
                                    id: this.id,
                                    label: this.seq_label,
                                    term_seq: this.term_seq,
                                    term_representation: this.representation,
                                },
                            ],
                        };
                }
            } else {
                return {
                    tag: ReducedFormTag.TexLine,
                    tex: wrap_html_id(this.representation, this.id),
                    tex_widget_properties: [
                        {
                            id: this.id,
                            label: this.seq_label,
                            term_seq: this.term_seq,
                            term_representation: this.representation,
                        },
                    ],
                };
            }
        } else if (cursor_socket_id === this.id) {
            let tex = wrap_html_id(
                active_socket_tex(
                    text_with_cursor(
                        this.left_entry_value,
                        this.cursor_position
                    )
                ),
                this.id
            );

            if (is_invalid) {
                tex = add_latex_color(tex, palette.warning);
            }

            return {
                tag: ReducedFormTag.TexLine,
                tex,
                tex_widget_properties: [
                    {
                        id: this.id,
                        label: this.seq_label,
                        term_seq: this.term_seq,
                        term_representation: this.representation,
                    },
                ],
            };
        } else {
            let tex = wrap_html_id(
                create_tex_text(
                    !!this.left_entry_value
                        ? this.left_entry_value
                        : LATEX_EMPTY_SOCKET
                ),
                this.id
            );

            if (is_invalid) {
                tex = add_latex_color(tex, palette.warning);
            }

            return {
                tag: ReducedFormTag.TexLine,
                tex,
                tex_widget_properties: [
                    {
                        id: this.id,
                        label: this.seq_label,
                        term_seq: this.term_seq,
                        term_representation: this.representation,
                    },
                ],
            };
        }
    };

    get_socket = (socket_id: string) => {
        if (socket_id === this.id) {
            return this;
        } else {
            return null;
        }
    };

    activate_left_cursor = (from_left: boolean) => {
        this.cursor_side = CursorSide.Left;

        if (from_left) {
            this.cursor_position = 0;
        } else {
            this.cursor_position = this.left_entry_value.length;
        }

        return this;
    };

    activate_right_cursor: (from_left: boolean) => VSocket = (
        from_left: boolean
    ) => {
        /*
         * If the socket is empty, then we always
         * favor the left side
         */
        if (!this.term_seq && !this.representation) {
            return this.activate_left_cursor(from_left);
        }

        this.cursor_side = CursorSide.Right;

        if (from_left) {
            this.cursor_position = 0;
        } else {
            this.cursor_position = this.right_entry_value.length;
        }

        return this;
    };

    get_child_sockets: () => VSocket[] = () => {
        return [];
    };

    /** This method checks whether we have the
     * right cursor activated, but the socket is
     * empty.  In this case, we delete all the content
     * in the right entry, and we move to the
     * end of the left entry */
    private check_right_left = () => {
        if (
            !this.term_seq &&
            !this.representation &&
            this.cursor_side === CursorSide.Right
        ) {
            this.right_entry_value = "";
            this.cursor_side = CursorSide.Left;
            this.cursor_position = this.left_entry_value.length;
        }

        /* Now we bring the cursor position in
         * bounds if it's out of bounds */
        if (this.cursor_position < 0) {
            this.cursor_position = 0;
        } else {
            switch (this.cursor_side) {
                case CursorSide.Left: {
                    if (this.cursor_position > this.left_entry_value.length) {
                        this.cursor_position = this.left_entry_value.length;
                    }
                    break;
                }
                case CursorSide.Right: {
                    if (this.cursor_position > this.right_entry_value.length) {
                        this.cursor_position = this.right_entry_value.length;
                    }
                    break;
                }
            }
        }
    };

    insert_char = (char: string) => {
        this.check_right_left();

        switch (this.cursor_side) {
            case CursorSide.Left: {
                this.left_entry_value =
                    this.left_entry_value.slice(0, this.cursor_position) +
                    char +
                    this.left_entry_value.slice(this.cursor_position);

                this.cursor_position++;

                break;
            }
            case CursorSide.Right: {
                this.right_entry_value =
                    this.right_entry_value.slice(0, this.cursor_position) +
                    char +
                    this.right_entry_value.slice(this.cursor_position);

                this.cursor_position++;

                break;
            }
        }
    };

    delete = (page_id: string) => {
        this.check_right_left();

        switch (this.cursor_side) {
            case CursorSide.Left: {
                if (this.cursor_position > 0) {
                    this.left_entry_value =
                        this.left_entry_value.slice(
                            0,
                            this.cursor_position - 1
                        ) + this.left_entry_value.slice(this.cursor_position);

                    this.cursor_position--;
                }
                break;
            }
            case CursorSide.Right: {
                if (this.cursor_position > 0) {
                    this.right_entry_value =
                        this.right_entry_value.slice(
                            0,
                            this.cursor_position - 1
                        ) + this.right_entry_value.slice(this.cursor_position);

                    this.cursor_position--;
                } else {
                    if (this.delete_prime_count === 0) {
                        this.delete_prime_count = 2;
                    } else {
                        kernel_link.delete_tds_contents(page_id, this.id);
                    }
                }
                break;
            }
        }
    };

    move_cursor_next = () => {
        /*
         * For both left and right, there's
         * a possibility of just moving to
         * the next socket altogether, so
         * why not throw all that logic in one
         * function to now repeat myself?
         */
        const move_cursor_next_socket = () => {
            /*
             * First we get the parent children, because
             * we want to get the next child in line
             */
            const parent_children = this.parent_socket.get_child_sockets();

            /*
             * Now we figure out my index in the list so I can
             * get the next socket
             */
            const self_index = parent_children
                .map((child) => child.get_id())
                .indexOf(this.id);

            /*
             * First handle the case where we're either not
             * in child ids (an error), or we're the last item
             *
             * In either case, we're going to push to the parent
             */
            if (self_index < 0 || self_index === parent_children.length - 1) {
                /* We're coming from the left (cause we're inside) */
                this.parent_socket.activate_right_cursor(true);

                return cursor_moved(this.parent_socket);
            } else {
                /* Otherwise, we push to the next child */
                const next_socket = parent_children[self_index + 1];

                /* We're coming from the left */
                return cursor_moved(next_socket.activate_left_cursor(true));
            }
        };

        switch (this.cursor_side) {
            case CursorSide.Left: {
                if (this.cursor_position < this.left_entry_value.length) {
                    this.cursor_position++;
                    return cursor_success();
                } else {
                    /*
                     * First handle the case where the socket is empty
                     */
                    if (!this.term_seq && !this.representation) {
                        return move_cursor_next_socket();
                    } else {
                        /*
                         * Ok, so I'm not empty.
                         * Let's see if I contain children
                         */
                        const children = this.get_child_sockets();

                        if (children.length === 0) {
                            /*
                             * Ok, if I don't have kids, then I
                             * just move on over to the right cursor
                             * position, and call it a day
                             */
                            this.cursor_side = CursorSide.Right;
                            this.cursor_position = 0;

                            return cursor_success();
                        } else {
                            /*
                             * Otherwise, we're sending this cursor
                             * right to my first child
                             */
                            const first_born = children[0];

                            /* We're coming in from the left */
                            first_born.activate_left_cursor(true);

                            return cursor_moved(first_born);
                        }
                    }
                }
            }
            case CursorSide.Right: {
                /*
                 * First just see if we can move to the
                 * next position
                 */
                if (this.cursor_position < this.right_entry_value.length) {
                    this.cursor_position++;
                    return cursor_success();
                } else {
                    /*
                     * If we're at the end, then we simply move to the
                     * next socket
                     */
                    return move_cursor_next_socket();
                }
            }
        }
    };

    move_cursor_previous = () => {
        switch (this.cursor_side) {
            case CursorSide.Left: {
                /* First determine if we're at the very beginning */
                if (this.cursor_position > 0) {
                    /* In this case, simply move the cursor on over */
                    this.cursor_position--;
                    return cursor_success();
                } else {
                    /*
                     * In this case, we're going to need to move this bad
                     * boy to the previous socket.  Start out by grabbing
                     * our parent's children
                     */
                    const parent_children =
                        this.parent_socket.get_child_sockets();

                    /* Figure out our place in the children */
                    const self_index = parent_children
                        .map((child) => child.get_id())
                        .indexOf(this.id);

                    /*
                     * Handle if we're not in the list, or at the front
                     * of the list.
                     *
                     * In this case, we're going straight to the parent socket.
                     * We're also coming from the right
                     */
                    if (self_index < 1) {
                        return cursor_moved(
                            this.parent_socket.activate_left_cursor(false)
                        );
                    } else {
                        /*
                         * Otherwise, activate the previous child.
                         * Note we're coming from the right
                         */
                        const previous_child = parent_children[self_index - 1];

                        return cursor_moved(
                            previous_child.activate_right_cursor(false)
                        );
                    }
                }
            }
            case CursorSide.Right: {
                /*
                 * First check if we're at the beginning of the
                 * input
                 */
                if (this.cursor_position > 0) {
                    this.cursor_position--;
                    return cursor_success();
                } else {
                    /* Now get our children */
                    const children = this.get_child_sockets();

                    /* Check if I have kids */
                    if (children.length === 0) {
                        /*
                         * If I don't have kids, then I can just
                         * pass the cursor over to the left cursor
                         */
                        this.cursor_side = CursorSide.Left;
                        this.cursor_position = this.left_entry_value.length;

                        return cursor_success();
                    } else {
                        /*
                         * Otherwise, I'm going to pass the cursor to my last child.
                         * I'm also coming at it from the right
                         */
                        const last_child = children[children.length - 1];

                        return cursor_moved(
                            last_child.activate_right_cursor(false)
                        );
                    }
                }
            }
        }
    };

    commit_seq = (page_id: string) => {
        if (!this.term_seq && !this.representation) {
            kernel_link.fill_term_def_socket(
                page_id,
                this.id,
                this.left_entry_value
            );
        }
    };
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

    num_selectable_sockets = () => {
        return 1;
    };

    label_selectable_sockets = (labels: string[]) => {
        const label = labels.pop();

        if (!!label) {
            this.seq_label = label;
        } else {
            throw new Error("Ran out of labels");
        }

        return labels;
    };

    get_term_def_socket = (socket_id: string) => {
        if (this.id === socket_id) {
            return this;
        } else {
            return null;
        }
    };

    get_expr_socket = () => {
        return null;
    };

    flag_invalid = () => {
        this.is_entry_invalid = true;
    };

    label_element = (label_barge: LabelBarge) => {
        return label_barge;
    };

    can_edit_content_rep = () => {
        return !!this.term_seq && !!this.representation;
    };
}
