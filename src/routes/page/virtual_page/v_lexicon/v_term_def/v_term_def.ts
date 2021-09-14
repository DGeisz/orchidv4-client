import { VLex } from "../v_lex";
import { TermDefSer } from "../../../page_types/page_serde/lexicon/term_def/term_def_serialization";
import { VExprSocket } from "../v_expression/v_expr_socket";
import { VSocket } from "../v_socket";
import { VTermDefSocket } from "./v_term_def_socket";
import {
    ReducedFormTag,
    ReducedFormType,
} from "../../../page_types/reduced_form/reduced_form";
import { add_latex_color } from "../../../utils/latex_utils";
import { palette } from "../../../../../global_styles/palette";

export class VTermDef implements VLex {
    private term_def_socket: VTermDefSocket;
    private type_socket: VExprSocket;

    constructor(term_def_ser: TermDefSer, parent_socket: VSocket) {
        const { term_def_socket_ser, type_socket_ser } = term_def_ser;

        this.type_socket = new VExprSocket(type_socket_ser, parent_socket);
        this.term_def_socket = new VTermDefSocket(
            term_def_socket_ser,
            parent_socket
        );
    }

    get_reduced_form: (c: string) => ReducedFormType[] = (
        cursor_socket_id: string
    ) => {
        const term_form =
            this.term_def_socket.get_reduced_form(cursor_socket_id);
        const type_form = this.type_socket.get_reduced_form(cursor_socket_id);

        if (!Array.isArray(type_form)) {
            return [term_form, type_form];
        } else {
            return [
                term_form,
                {
                    tag: ReducedFormTag.TexLine,
                    tex: add_latex_color("ERROR", palette.warning),
                    socket_ids: [],
                },
            ];
        }
    };

    get_socket = (socket_id: string) => {
        const term_socket_result = this.term_def_socket.get_socket(socket_id);

        if (!!term_socket_result) {
            return term_socket_result;
        } else {
            return this.type_socket.get_socket(socket_id);
        }
    };

    get_child_sockets = () => {
        return [this.term_def_socket, this.type_socket];
    };

    num_selectable_sockets = () => {
        return (
            this.term_def_socket.num_selectable_sockets() +
            this.type_socket.num_selectable_sockets()
        );
    };

    label_selectable_sockets = (labels: string[]) => {
        const remaining = this.term_def_socket.label_selectable_sockets(labels);
        return this.type_socket.label_selectable_sockets(remaining);
    };
}
