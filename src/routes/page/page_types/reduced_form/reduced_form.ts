import { palette } from "../../../../global_styles/palette";
import { add_latex_color, create_tex_text } from "../../utils/latex_utils";
import { IdTexWidgetProperties } from "../../building_blocks/tex_element/tex_types/tex_types";

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
    tex_widget_properties: IdTexWidgetProperties[];
}

export function error_form(): ReducedFormType {
    return {
        tag: ReducedFormTag.TexLine,
        tex: add_latex_color(create_tex_text("ERROR"), palette.danger),
        tex_widget_properties: [],
    };
}

export interface GlobalHeaderType {
    tag: ReducedFormTag.GlobalHeader;
    title: string;
    title_color: string;
    main_tex: string;
    main_widget_properties: IdTexWidgetProperties[];
    label: string;
    label_widget_properties: IdTexWidgetProperties[];
    pg_index: string;
    children: ReducedFormType[];
    left_cursor_active?: boolean;
    right_cursor_active?: boolean;
    background_color?: string;
}

export interface SurroundIndentType {
    tag: ReducedFormTag.SurroundIndent;
    header_tex: string;
    header_widget_properties: IdTexWidgetProperties[];
    children: ReducedFormType[];
    footer_tex: string;
    footer_widget_properties: IdTexWidgetProperties[];
    body_name: string;
    label?: string;
    pg_index?: string;
}

export interface InlinePropType {
    tag: ReducedFormTag.InlineProp;
    prop: string;
    prop_widget_properties: IdTexWidgetProperties[];
    explanation: string;
    label: string;
    label_widget_properties: IdTexWidgetProperties[];
    pg_index: string;
}

export interface LambdaPropType {
    tag: ReducedFormTag.LambdaProp;
    intro_tex: string;
    intro_widget_properties: IdTexWidgetProperties[];
    label: string;
    label_widget_properties: IdTexWidgetProperties[];
    pg_index: string;
    children: ReducedFormType[];
}

export type ReducedFormType =
    | TexLineType
    | GlobalHeaderType
    | SurroundIndentType
    | InlinePropType
    | LambdaPropType;
