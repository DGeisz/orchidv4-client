import { VDeclaration } from "../v_declaration";
import { ConstSer } from "../../../../../../global_serde/lexicon/declaration/constant/const_serialization";

export class VConstant extends VDeclaration {
    constructor(const_ser: ConstSer) {
        super();
    }
}
