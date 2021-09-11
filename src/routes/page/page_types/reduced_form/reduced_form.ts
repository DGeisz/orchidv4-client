import { palette } from "../../../../global_styles/palette";
import { add_latex_color, create_tex_text } from "../../utils/latex_utils";

export enum ReducedFormTag {
    TexLine,
    GlobalHeader,
    SurroundIndent,
    InlineProp,
    LambdaProp,
}

export interface TexLineType {
    tag: ReducedFormTag.TexLine;
    tex: string;
}

export function error_form(): ReducedFormType {
    return {
        tag: ReducedFormTag.TexLine,
        tex: add_latex_color(create_tex_text("ERROR"), palette.danger),
    };
}

export interface GlobalHeaderType {
    tag: ReducedFormTag.GlobalHeader;
    title: string;
    title_color: string;
    main_tex: string;
    label: string;
    pg_index: string;
    children: ReducedFormType[];
}

export interface SurroundIndentType {
    tag: ReducedFormTag.SurroundIndent;
    header_tex: string;
    children: ReducedFormType[];
    footer_tex: string;
    body_name: string;
    label?: string;
    pg_index?: string;
}

export interface InlinePropType {
    tag: ReducedFormTag.InlineProp;
    prop: string;
    explanation: string;
    label: string;
    pg_index: string;
}

export interface LambdaPropType {
    tag: ReducedFormTag.LambdaProp;
    intro_tex: string;
    label: string;
    pg_index: string;
    children: ReducedFormType[];
}

export type ReducedFormType =
    | TexLineType
    | GlobalHeaderType
    | SurroundIndentType
    | InlinePropType
    | LambdaPropType;

export const example_reduced_forms: ReducedFormType[] = [
    {
        tag: ReducedFormTag.GlobalHeader,
        title: "Axiom",
        title_color: palette.uni_form_red,
        main_tex: "\\alpha \\Rightarrow \\beta",
        label: "b",
        pg_index: "1.01",
        children: [],
    },
    {
        tag: ReducedFormTag.GlobalHeader,
        title: "Theorem",
        title_color: palette.exi_form_blue,
        main_tex: "\\frac{\\zeta}{\\Omega}",
        label: "b",
        pg_index: "1.02",
        children: [
            {
                tag: ReducedFormTag.TexLine,
                tex: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
            },
            {
                tag: ReducedFormTag.TexLine,
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
        ],
    },
    {
        tag: ReducedFormTag.SurroundIndent,
        header_tex: "\\vdash \\; p \\wedge q \\Rightarrow p",
        body_name: "proof",
        children: [
            {
                tag: ReducedFormTag.LambdaProp,
                intro_tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                label: "t",
                pg_index: "3.01",
                children: [
                    {
                        tag: ReducedFormTag.TexLine,
                        tex: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
                    },
                    {
                        tag: ReducedFormTag.TexLine,
                        tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                    },
                    {
                        tag: ReducedFormTag.TexLine,
                        tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                    },
                    {
                        tag: ReducedFormTag.TexLine,
                        tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                    },
                    {
                        tag: ReducedFormTag.InlineProp,
                        prop: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
                        explanation: "Use butt with other butt",
                        label: "r",
                        pg_index: "1.14",
                    },
                    {
                        tag: ReducedFormTag.InlineProp,
                        prop: "\\frac{\\omega \\Rightarrow \\delta}{\\int_{x = 2}^{x = 4} x^3 dx}",
                        explanation: "Use butt with other butt",
                        label: "r",
                        pg_index: "1.14",
                    },
                ],
            },
            {
                tag: ReducedFormTag.TexLine,
                tex: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
            },
            {
                tag: ReducedFormTag.TexLine,
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
            {
                tag: ReducedFormTag.TexLine,
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
            {
                tag: ReducedFormTag.TexLine,
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
            {
                tag: ReducedFormTag.InlineProp,
                prop: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
                explanation: "Use butt with other butt",
                label: "r",
                pg_index: "1.14",
            },
            {
                tag: ReducedFormTag.InlineProp,
                prop: "\\frac{\\omega \\Rightarrow \\delta}{\\int_{x = 2}^{x = 4} x^3 dx}",
                explanation: "Use butt with other butt",
                label: "r",
                pg_index: "1.14",
            },
        ],
        footer_tex: "\\therefore \\; p \\wedge q \\Rightarrow p",
        label: "b",
        pg_index: "1.02",
    },
];
