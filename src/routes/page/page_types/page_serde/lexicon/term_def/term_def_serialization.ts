import { ExprSocketSer } from "../expression/expr_serialization";
import { Option } from "../../utils/rust_option";

export interface TermDefSocketSer {
    id: string;
    term_seq: Option<string>;
    representation: Option<string>;
}

export interface TermDefSer {
    term_def_socket_ser: TermDefSocketSer;
    type_socket_ser: ExprSocketSer;
}
