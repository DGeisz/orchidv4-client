import {
    ConstSer,
    ConstVariation,
} from "../../../../page_types/page_serde/lexicon/declaration/constant/const_serialization";
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

export class VConstant implements VLex {
    private variation: ConstVariation;

    constructor(const_ser: ConstSer) {
        this.variation = const_ser.variation;
    }

    get_reduced_form: (c: string) => ReducedFormType = () => {
        return {
            tag: ReducedFormTag.TexLine,
            tex: `${add_latex_color(
                create_tex_text("constant"),
                palette.condi_form_salmon
            )} ${LATEX_SPACE} \\Omega : \\mathbb{R}`,
        };
    };

    get_child_sockets = () => {
        return [];
    };
}
