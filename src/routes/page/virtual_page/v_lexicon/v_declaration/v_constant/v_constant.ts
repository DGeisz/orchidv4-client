import {
    ConstSer,
    ConstVariation,
} from "../../../../page_types/page_serde/lexicon/declaration/constant/const_serialization";
import { LabelBarge, VLex } from "../../v_lex";
import {
    error_form,
    ReducedFormTag,
    ReducedFormType,
} from "../../../../page_types/reduced_form/reduced_form";
import {
    add_latex_color,
    create_tex_text,
    LATEX_SPACE,
} from "../../../../utils/latex_utils";
import { palette } from "../../../../../../global_styles/palette";
import { VTermDef } from "../../v_term_def/v_term_def";
import { VSocket } from "../../v_socket";

export class VConstant implements VLex {
    private readonly variation: ConstVariation;
    private term_def: VTermDef;
    private parent_socket: VSocket;
    private major_label: number = 0;

    constructor(const_ser: ConstSer, parent_socket: VSocket) {
        const { variation, term_def_ser } = const_ser;

        this.parent_socket = parent_socket;
        this.variation = variation;
        this.term_def = new VTermDef(term_def_ser, parent_socket);
    }

    get_reduced_form: (c: string) => ReducedFormType = (
        cursor_socket_id: string
    ) => {
        const term_forms = this.term_def.get_reduced_form(cursor_socket_id);

        if (
            term_forms[0].tag !== ReducedFormTag.TexLine ||
            term_forms[1].tag !== ReducedFormTag.TexLine
        ) {
            return error_form();
        }

        switch (this.variation) {
            case ConstVariation.Axiom:
                return {
                    tag: ReducedFormTag.GlobalHeader,
                    title: "Axiom",
                    title_color: palette.uni_form_red,
                    main_tex: term_forms[1].tex,
                    main_widget_properties: term_forms[1].tex_widget_properties,
                    label: term_forms[0].tex,
                    label_widget_properties:
                        term_forms[0].tex_widget_properties,
                    pg_index: `${this.major_label}`,
                    children: [],
                };
            case ConstVariation.Constant:
                return {
                    tag: ReducedFormTag.TexLine,
                    tex: `${add_latex_color(
                        create_tex_text("constant"),
                        palette.condi_form_salmon
                    )} ${LATEX_SPACE}${LATEX_SPACE} ${term_forms[0].tex} : ${
                        term_forms[1].tex
                    }`,
                    tex_widget_properties: [
                        ...term_forms[0].tex_widget_properties,
                        ...term_forms[1].tex_widget_properties,
                    ],
                };
        }
    };

    get_child_sockets = () => {
        const def_sockets = this.term_def.get_child_sockets();

        if (this.variation === ConstVariation.Constant) {
            return [...def_sockets];
        } else {
            return [def_sockets[1], def_sockets[0]];
        }
    };

    get_socket = (socket_id: string) => {
        return this.term_def.get_socket(socket_id);
    };

    num_selectable_sockets = () => {
        return this.term_def.num_selectable_sockets();
    };

    label_selectable_sockets = (labels: string[]) => {
        return this.term_def.label_selectable_sockets(labels);
    };

    get_term_def_socket = (socket_id: string) => {
        return this.term_def.get_term_def_socket(socket_id);
    };

    get_expr_socket = (socket_id: string) => {
        return this.term_def.get_expr_socket(socket_id);
    };

    label_element = (label_barge: LabelBarge) => {
        if (this.variation === ConstVariation.Axiom) {
            this.major_label = label_barge.pedal_major_label();
        }

        return label_barge;
    };
}
