import { palette } from "../../../global_styles/palette";

export interface TexLineType {
    tex: string;
}

export function is_tex_line(form: ReducedFormType): form is TexLineType {
    return form.hasOwnProperty("tex");
}

export interface GlobalHeaderType {
    title: string;
    title_color: string;
    main_tex: string;
    label: string;
    pg_index: string;
    children: ReducedFormType[];
}

export function is_global_header(
    form: ReducedFormType
): form is GlobalHeaderType {
    return form.hasOwnProperty("title");
}

export interface SurroundIndentType {
    header_tex: string;
    children: ReducedFormType[];
    footer_tex: string;
    body_name: string;
    label?: string;
    pg_index?: string;
}

export function is_surround_indent(
    form: ReducedFormType
): form is SurroundIndentType {
    return form.hasOwnProperty("header_tex");
}

export interface InlinePropType {
    prop: string;
    explanation: string;
    label: string;
    pg_index: string;
}

export function is_inline_prop(form: ReducedFormType): form is InlinePropType {
    return form.hasOwnProperty("prop");
}

export interface LambdaPropType {
    intro_tex: string;
    label: string;
    pg_index: string;
    children: ReducedFormType[];
}

export function is_lambda_prop(form: ReducedFormType): form is LambdaPropType {
    return form.hasOwnProperty("intro_tex");
}

export type ReducedFormType =
    | TexLineType
    | GlobalHeaderType
    | SurroundIndentType
    | InlinePropType
    | LambdaPropType;

export const example_reduced_forms: ReducedFormType[] = [
    {
        title: "Axiom",
        title_color: palette.uni_form_red,
        main_tex: "\\alpha \\Rightarrow \\beta",
        label: "b",
        pg_index: "1.01",
        children: [],
    },
    {
        title: "Theorem",
        title_color: palette.exi_form_blue,
        main_tex: "\\frac{\\zeta}{\\Omega}",
        label: "b",
        pg_index: "1.02",
        children: [
            {
                tex: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
            },
            {
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
        ],
    },
    {
        header_tex: "\\vdash \\; p \\wedge q \\Rightarrow p",
        body_name: "proof",
        children: [
            {
                intro_tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                label: "t",
                pg_index: "3.01",
                children: [
                    {
                        tex: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
                    },
                    {
                        tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                    },
                    {
                        tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                    },
                    {
                        tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
                    },
                    {
                        prop: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
                        explanation: "Use butt with other butt",
                        label: "r",
                        pg_index: "1.14",
                    },
                    {
                        prop: "\\frac{\\omega \\Rightarrow \\delta}{\\int_{x = 2}^{x = 4} x^3 dx}",
                        explanation: "Use butt with other butt",
                        label: "r",
                        pg_index: "1.14",
                    },
                ],
            },
            {
                tex: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
            },
            {
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
            {
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
            {
                tex: `\\text{{\\color{${palette.condi_form_salmon}}{{let}}} \\: $\\zeta$ \\; := \\; $\\beta$}`,
            },
            {
                prop: "\\frac{\\alpha \\Rightarrow \\zeta}{\\eta}",
                explanation: "Use butt with other butt",
                label: "r",
                pg_index: "1.14",
            },
            {
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
