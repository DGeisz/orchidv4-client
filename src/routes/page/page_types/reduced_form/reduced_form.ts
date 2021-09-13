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
    socket_ids: string[];
}

export function error_form(): ReducedFormType {
    return {
        tag: ReducedFormTag.TexLine,
        tex: add_latex_color(create_tex_text("ERROR"), palette.danger),
        socket_ids: [],
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
    left_cursor_active?: boolean;
    right_cursor_active?: boolean;
    background_color?: string;
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
