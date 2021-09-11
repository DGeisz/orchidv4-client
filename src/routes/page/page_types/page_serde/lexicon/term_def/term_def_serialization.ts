import { ExprSocketSer } from "../expression/expr_serialization";

export interface TermDefSocketSer {
    id: string;
}

export interface TermDefSer {
    term_def_socket_ser: TermDefSocketSer;
    type_socket_ser: ExprSocketSer;
}
