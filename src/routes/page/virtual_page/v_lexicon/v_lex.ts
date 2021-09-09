import { ReducedFormType } from "../../reduced_form/reduced_form";
import { VSocket } from "./v_socket";

export interface VLex {
    get_reduced_form: (
        cursor_socket_id: string
    ) => ReducedFormType | ReducedFormType[];
    get_child_sockets: () => VSocket[];
}
