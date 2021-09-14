import { palette } from "../../../../global_styles/palette";
import { add_latex_color, create_tex_text } from "../../utils/latex_utils";

export interface SocketId {
    id: string;
    label: string;
}

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
    socket_ids: SocketId[];
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
    main_socket_ids: SocketId[];
    label: string;
    label_socket_ids: SocketId[];
    pg_index: string;
    children: ReducedFormType[];
    left_cursor_active?: boolean;
    right_cursor_active?: boolean;
    background_color?: string;
}

export interface SurroundIndentType {
    tag: ReducedFormTag.SurroundIndent;
    header_tex: string;
    header_socket_ids: SocketId[];
    children: ReducedFormType[];
    footer_tex: string;
    footer_socket_ids: SocketId[];
    body_name: string;
    label?: string;
    pg_index?: string;
}

export interface InlinePropType {
    tag: ReducedFormTag.InlineProp;
    prop: string;
    prop_socket_ids: SocketId[];
    explanation: string;
    label: string;
    label_socket_ids: SocketId[];
    pg_index: string;
}

export interface LambdaPropType {
    tag: ReducedFormTag.LambdaProp;
    intro_tex: string;
    intro_socket_ids: SocketId[];
    label: string;
    label_socket_ids: SocketId[];
    pg_index: string;
    children: ReducedFormType[];
}

export type ReducedFormType =
    | TexLineType
    | GlobalHeaderType
    | SurroundIndentType
    | InlinePropType
    | LambdaPropType;
