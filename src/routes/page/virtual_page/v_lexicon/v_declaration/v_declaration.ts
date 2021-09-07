import { DecSk } from "../../../page_skeleton/lexicon_sk/declaration_sk/dec_sk";

export class VDeclaration {
    get_skeleton: () => DecSk = () => {
        return {
            tag: "empty",
        };
    };
}

export class VEmptyDec extends VDeclaration {}
