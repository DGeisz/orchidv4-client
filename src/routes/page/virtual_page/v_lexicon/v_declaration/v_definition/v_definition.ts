import { DefSer } from "../../../../page_types/page_serde/lexicon/declaration/defintion/def_serialization";
import { VLex } from "../../v_lex";
import {
    ReducedFormTag,
    ReducedFormType,
} from "../../../../page_types/reduced_form/reduced_form";
import {
    add_latex_color,
    create_tex_text,
    LATEX_SPACE,
} from "../../../../utils/latex_utils";
import { palette } from "../../../../../../global_styles/palette";

export class VDefinition implements VLex {
    constructor(def_ser: DefSer) {}

    get_reduced_form: (c: string) => ReducedFormType = () => {
        return {
            tag: ReducedFormTag.TexLine,
            tex: `${add_latex_color(
                create_tex_text("def"),
                palette.condi_form_salmon
            )} ${LATEX_SPACE + LATEX_SPACE} \\alpha \\; := \\frac{1}{2}`,
        };
    };

    get_child_sockets = () => {
        return [];
    };
}
