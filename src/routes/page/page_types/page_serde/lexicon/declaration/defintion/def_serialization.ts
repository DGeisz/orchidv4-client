import { TermDefSer } from "../../term_def/term_def_serialization";
import { ExprSocketSer } from "../../expression/expr_serialization";

export enum DefVariation {
    Definition = "Definition",
    Theorem = "Theorem",
    Lemma = "Lemma",
}

export interface DefSer {
    variation: DefVariation;
    term_def_ser: TermDefSer;
    term_expr_ser: ExprSocketSer;
}
