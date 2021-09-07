import {
    DecSocketSer,
    is_const,
} from "../../../../../global_serde/lexicon/declaration/dec_serialization";
import { VDeclaration, VEmptyDec } from "./v_declaration";
import { isSome } from "../../../../../global_serde/utils/rust_option";
import { VConstant } from "./v_constant/v_constant";
import { VDefinition } from "./v_definition/v_definition";
import { DecSocketSk } from "../../../page_skeleton/lexicon_sk/declaration_sk/dec_socket_sk";

export class VDecSocket {
    private declaration: VDeclaration;
    private id: string;

    constructor(dec_socket_ser: DecSocketSer) {
        const { id, dec_ser } = dec_socket_ser;
        this.id = id;

        if (isSome(dec_ser)) {
            const { Some: dec_some } = dec_ser;

            if (is_const(dec_some)) {
                this.declaration = new VConstant(dec_some.Const);
            } else {
                this.declaration = new VDefinition(dec_some.Def);
            }
        } else {
            this.declaration = new VEmptyDec();
        }
    }

    get_skeleton: () => DecSocketSk = () => {
        return {
            id: this.id,
            declaration: this.declaration.get_skeleton(),
        };
    };
}
