import { VSocket } from "./v_socket";
import { ReducedFormType } from "../../page_types/reduced_form/reduced_form";

export interface VLex {
    get_reduced_form: (
        cursor_socket_id: string
    ) => ReducedFormType | ReducedFormType[];

    get_child_sockets: () => VSocket[];

    get_socket: (socket_id: string) => VSocket | null;
}
