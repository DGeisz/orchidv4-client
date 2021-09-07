import { Option } from "../../utils/rust_option";
import { ConstSer } from "./constant/const_serialization";
import { DefSer } from "./defintion/def_serialization";

export interface DecSocketSer {
    id: string;
    dec_ser: Option<DecSer>;
}

type Const = { Const: ConstSer };
type Def = { Def: DefSer };

export type DecSer = Const | Def;

export function is_const(dec_ser: DecSer): dec_ser is Const {
    return dec_ser.hasOwnProperty("Const");
}

export function is_dec(dec_ser: DecSer): dec_ser is Def {
    return dec_ser.hasOwnProperty("Def");
}
