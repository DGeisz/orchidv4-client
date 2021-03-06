import { VSocket } from "./v_socket";
import { ReducedFormType } from "../../page_types/reduced_form/reduced_form";
import { VTermDefSocket } from "./v_term_def/v_term_def_socket";
import { VExprSocket } from "./v_expression/v_expr_socket";

export interface VLex {
    get_reduced_form: (
        cursor_socket_id: string
    ) => ReducedFormType | ReducedFormType[];
    get_child_sockets: () => VSocket[];
    get_socket: (socket_id: string) => VSocket | null;

    num_selectable_sockets: () => number;
    label_selectable_sockets: (labels: string[]) => string[];
    get_term_def_socket: (socket_id: string) => VTermDefSocket | null;
    get_expr_socket: (socket_id: string) => VExprSocket | null;
    label_element: (label_barge: LabelBarge) => LabelBarge;
}

export class LabelBarge {
    private major: number = 0;
    private minor: number = 0;

    pedal_major_label = () => {
        this.major++;

        return this.major;
    };

    pedal_minor_label = () => {
        this.minor++;

        return this.minor;
    };

    get_major_label = () => {
        return this.major;
    };
}
