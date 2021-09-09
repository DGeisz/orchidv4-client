import { VDeclaration } from "../v_declaration";
import { ConstSer } from "../../../../page_types/page_serde/lexicon/declaration/constant/const_serialization";

export class VConstant extends VDeclaration {
    constructor(const_ser: ConstSer) {
        super();
    }
}
