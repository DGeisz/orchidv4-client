import { TermDefSer } from "../../term_def/term_def_serialization";

export enum ConstVariation {
    Constant = "Constant",
    Axiom = "Axiom",
}

export interface ConstSer {
    variation: ConstVariation;
    term_def_ser: TermDefSer;
}
