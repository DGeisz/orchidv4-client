import { VConstant } from "./v_constant/v_constant";
import { VDefinition } from "./v_definition/v_definition";
import { cursor_moved, cursor_success, CursorSide, VSocket } from "../v_socket";
import { is_some } from "../../../page_types/page_serde/utils/rust_option";
import {
    DecSer,
    DecSocketSer,
    is_const,
    is_def,
} from "../../../page_types/page_serde/lexicon/declaration/dec_serialization";
import {
    error_form,
    ReducedFormTag,
    ReducedFormType,
} from "../../../page_types/reduced_form/reduced_form";
import { VLex } from "../v_lex";
import { kernel_link } from "../../../../../kernel_link/kernel_link";
import {
    add_color_box,
    create_tex_text,
    LATEX_EMPTY_SOCKET,
    LATEX_SPACE,
    text_with_cursor,
    wrap_html_id,
} from "../../../utils/latex_utils";
import { palette } from "../../../../../global_styles/palette";
import { VirtualPage } from "../../virtual_page";

export class VDecSocket implements VSocket {
    private declaration?: VLex;
    private readonly id: string;
    private readonly virtual_page: VirtualPage;
    private seq_label: string = "";

    /*
     * Next fields are for cursor position
     */
    private cursor_side: CursorSide = CursorSide.Left;
    private left_entry_value: string = "";
    private right_entry_value: string = "";
    private cursor_position: number = 0;

    /* For priming delete */
    private delete_prime_count: number = 0;

    constructor(dec_socket_ser: DecSocketSer, virtual_page: VirtualPage) {
        const { id, dec_ser } = dec_socket_ser;
        this.id = id;
        this.virtual_page = virtual_page;

        if (is_some(dec_ser)) {
            if (is_const(dec_ser)) {
                this.declaration = new VConstant(
                    dec_ser.Const,
                    this,
                    this.virtual_page
                );
            } else {
                this.declaration = new VDefinition(
                    dec_ser.Def,
                    this,
                    this.virtual_page
                );
            }
        }
    }

    update = (dec_socket_ser: DecSocketSer) => {
        if (dec_socket_ser.id === this.id) {
            if (is_some<DecSer>(dec_socket_ser.dec_ser)) {
                const { dec_ser } = dec_socket_ser;

                if (is_const(dec_ser)) {
                    this.declaration = new VConstant(
                        dec_ser.Const,
                        this,
                        this.virtual_page
                    );
                } else if (is_def(dec_ser)) {
                    this.declaration = new VDefinition(
                        dec_ser.Def,
                        this,
                        this.virtual_page
                    );
                }
            } else {
                this.declaration = undefined;
            }

            this.left_entry_value = "";
            this.right_entry_value = "";
            this.cursor_position = 0;
        }
    };

    get_reduced_form: (cursor_socket_id: string) => ReducedFormType = (
        cursor_socket_id: string
    ) => {
        /* First decrease the prime count */
        if (this.delete_prime_count > 0) {
            this.delete_prime_count--;
        }

        if (!!this.declaration) {
            const child_form =
                this.declaration.get_reduced_form(cursor_socket_id);

            if (!Array.isArray(child_form)) {
                if (cursor_socket_id === this.id) {
                    switch (child_form.tag) {
                        case ReducedFormTag.TexLine: {
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
                                                child_form.tex,
                                            bg_color
                                        ),
                                        socket_ids: child_form.socket_ids,
                                    };
                                case CursorSide.Right:
                                    return {
                                        tag: ReducedFormTag.TexLine,
                                        tex: add_color_box(
                                            child_form.tex +
                                                LATEX_SPACE +
                                                text_with_cursor(
                                                    this.right_entry_value,
                                                    this.cursor_position
                                                ),
                                            bg_color
                                        ),
                                        socket_ids: child_form.socket_ids,
                                    };
                            }
                            break;
                        }
                        case ReducedFormTag.GlobalHeader: {
                            const background_color =
                                this.delete_prime_count > 0
                                    ? palette.danger_hover
                                    : undefined;

                            switch (this.cursor_side) {
                                case CursorSide.Left:
                                    return {
                                        ...child_form,
                                        left_cursor_active: true,
                                        background_color,
                                    };
                                case CursorSide.Right:
                                    return {
                                        ...child_form,
                                        right_cursor_active: true,
                                        background_color,
                                    };
                            }
                            break;
                        }
                        default:
                            return child_form;
                    }
                } else {
                    return child_form;
                }
            } else {
                return error_form();
            }
        } else if (cursor_socket_id === this.id) {
            return {
                tag: ReducedFormTag.TexLine,
                tex: wrap_html_id(
                    text_with_cursor(
                        this.left_entry_value,
                        this.cursor_position
                    ),
                    this.id
                ),
                socket_ids: [
                    {
                        id: this.id,
                        label: this.seq_label,
                    },
                ],
            };
        } else {
            return {
                tag: ReducedFormTag.TexLine,
                tex: wrap_html_id(
                    create_tex_text(
                        !!this.left_entry_value
                            ? this.left_entry_value
                            : LATEX_EMPTY_SOCKET
                    ),
                    this.id
                ),
                socket_ids: [
                    {
                        id: this.id,
                        label: this.seq_label,
                    },
                ],
            };
        }
    };

    get_id = () => {
        return this.id;
    };

    get_socket = (socket_id: string) => {
        if (this.id === socket_id) {
            return this;
        } else if (!!this.declaration) {
            return this.declaration.get_socket(socket_id);
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
        if (!this.declaration) {
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

    get_child_sockets = () => {
        if (!!this.declaration) {
            return this.declaration.get_child_sockets();
        } else {
            return [];
        }
    };

    /** This method checks whether we have the
     * right cursor activated, but the socket is
     * empty.  In this case, we delete all the content
     * in the right entry, and we move to the
     * end of the left entry */
    private check_right_left = () => {
        if (!this.declaration && this.cursor_side === CursorSide.Right) {
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

    delete = () => {
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
                } else {
                    if (!this.declaration) {
                        this.virtual_page.delete_dec_socket(this.id);
                    }
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
                        this.virtual_page.delete_dec_socket_contents(this.id);
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
            const parent_children = this.virtual_page.get_child_sockets();

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
                return cursor_moved(this.virtual_page.activate_right_cursor());
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
                    if (!this.declaration) {
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
                        this.virtual_page.get_child_sockets();

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
                            this.virtual_page.activate_left_cursor()
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
        if (!this.declaration) {
            if (!!this.left_entry_value) {
                kernel_link.fill_dec_socket(
                    page_id,
                    this.id,
                    this.left_entry_value
                );
            } else {
                this.virtual_page.insert_dec_socket(this.id, true);
            }
        } else {
            switch (this.cursor_side) {
                case CursorSide.Left: {
                    this.virtual_page.insert_dec_socket(this.id, true);
                    break;
                }
                case CursorSide.Right: {
                    this.virtual_page.insert_dec_socket(this.id, false);
                    break;
                }
            }
        }
    };

    check_cursor = () => {
        /* If this socket is filled and still
         * has the cursor, we pass the cursor down
         * to the most appropriate child, if there
         * are any */
        if (!!this.declaration) {
            return null;
            // const children = this.get_child_sockets();
            //
            // if (children.length > 0) {
            //     switch (this.cursor_side) {
            //         case CursorSide.Left:
            //             this.left_entry_value = "";
            //             return children[0].activate_left_cursor(true);
            //         case CursorSide.Right:
            //             this.right_entry_value = "";
            //             return children[
            //                 children.length - 1
            //             ].activate_right_cursor(false);
            //     }
            // } else {
            //     return null;
            // }
        } else {
            return null;
        }
    };

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
        if (!!this.declaration) {
            return this.declaration.num_selectable_sockets();
        } else {
            return 1;
        }
    };

    label_selectable_sockets = (labels: string[]) => {
        if (!!this.declaration) {
            return this.declaration.label_selectable_sockets(labels);
        } else {
            const label = labels.pop();

            if (!!label) {
                this.seq_label = label;
            } else {
                throw new Error("Ran out of labels");
            }

            return labels;
        }
    };
}
