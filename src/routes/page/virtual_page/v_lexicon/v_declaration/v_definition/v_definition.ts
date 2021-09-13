import {
    DefSer,
    DefVariation,
} from "../../../../page_types/page_serde/lexicon/declaration/defintion/def_serialization";
import { VLex } from "../../v_lex";
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
import { VExprSocket } from "../../v_expression/v_expr_socket";
import { VSocket } from "../../v_socket";
import { VirtualPage } from "../../../virtual_page";

export class VDefinition implements VLex {
    private readonly variation: DefVariation;
    private term_def: VTermDef;
    private readonly term_expr: VExprSocket;
    private virtual_page: VirtualPage;

    constructor(
        def_ser: DefSer,
        parent_socket: VSocket,

        virtual_page: VirtualPage
    ) {
        const { term_def_ser, term_expr_ser, variation } = def_ser;

        this.virtual_page = virtual_page;
        this.variation = variation;
        this.term_def = new VTermDef(term_def_ser, parent_socket);
        this.term_expr = new VExprSocket(term_expr_ser, parent_socket);
    }

    get_reduced_form: (c: string) => ReducedFormType = (
        cursor_socket_id: string
    ) => {
        const def_forms = this.term_def.get_reduced_form(cursor_socket_id);
        const expr_form = this.term_expr.get_reduced_form(cursor_socket_id);

        if (
            def_forms[0].tag !== ReducedFormTag.TexLine ||
            def_forms[1].tag !== ReducedFormTag.TexLine
        ) {
            return error_form();
        }

        switch (this.variation) {
            case DefVariation.Definition:
                const base_tex = `${add_latex_color(
                    create_tex_text("def"),
                    palette.condi_form_salmon
                )} ${LATEX_SPACE + LATEX_SPACE} ${
                    def_forms[0].tex
                } ${LATEX_SPACE} : ${LATEX_SPACE} ${
                    def_forms[1].tex
                } ${LATEX_SPACE} := ${LATEX_SPACE}`;

                if (Array.isArray(expr_form)) {
                    return {
                        tag: ReducedFormTag.SurroundIndent,
                        body_name: "body",
                        header_tex: `${base_tex}\\{`,
                        children: expr_form,
                        footer_tex: "\\}",
                    };
                } else {
                    if (expr_form.tag === ReducedFormTag.TexLine) {
                        return {
                            tag: ReducedFormTag.TexLine,
                            tex: `${base_tex} ${expr_form.tex}`,
                        };
                    } else {
                        return error_form();
                    }
                }
            default:
                let children: ReducedFormType[];

                if (Array.isArray(expr_form)) {
                    children = expr_form;
                } else {
                    children = [expr_form];
                }

                return {
                    tag: ReducedFormTag.GlobalHeader,
                    title: this.variation,
                    title_color:
                        this.variation === DefVariation.Theorem
                            ? palette.exi_form_blue
                            : palette.sel_fg_pink,
                    main_tex: def_forms[1].tex,
                    label: def_forms[0].tex,
                    pg_index: "1.infty",
                    children,
                };
        }
    };

    get_child_sockets = () => {
        const def_sockets = this.term_def.get_child_sockets();

        if (this.variation === DefVariation.Definition) {
            return [...def_sockets, this.term_expr];
        } else {
            return [def_sockets[1], def_sockets[0], this.term_expr];
        }
    };
}
