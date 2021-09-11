import { BlockSer } from "./block/block_ser";
import { LamSer } from "./lambda_abstraction/lam_ser";
import { LetSer } from "./let_assignment/let_ser";
import { PiSer } from "./pi_type/pi_ser";
import { SortSer } from "./sort/sort_ser";
import { VarSer } from "./variable/var_ser";
import { Option } from "../../utils/rust_option";

export interface ExprSocketSer {
    id: string;
    expr_ser: Option<ExprSer>;
}

type Block = { Block: BlockSer };
type Lam = { Lam: LamSer };
type Let = { Let: LetSer };
type Pi = { Pi: PiSer };
type Sort = { Sort: SortSer };
type Var = { Var: VarSer };

export type ExprSer = Block | Lam | Let | Pi | Sort | Var;

export function is_block(expr_ser: ExprSer): expr_ser is Block {
    return expr_ser.hasOwnProperty("Block");
}

export function is_lam(expr_ser: ExprSer): expr_ser is Lam {
    return expr_ser.hasOwnProperty("Lam");
}

export function is_let(expr_ser: ExprSer): expr_ser is Let {
    return expr_ser.hasOwnProperty("Let");
}

export function is_pi(expr_ser: ExprSer): expr_ser is Pi {
    return expr_ser.hasOwnProperty("Pi");
}

export function is_sort(expr_ser: ExprSer): expr_ser is Sort {
    return expr_ser.hasOwnProperty("Sort");
}

export function is_var(expr_ser: ExprSer): expr_ser is Var {
    return expr_ser.hasOwnProperty("Var");
}
