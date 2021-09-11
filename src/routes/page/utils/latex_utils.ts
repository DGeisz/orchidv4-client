import { palette } from "../../../global_styles/palette";

export function add_latex_color(tex: string, color: string) {
    return `{\\color{${color}}{${tex}}}`;
}

export function add_color_box(tex: string, color: string) {
    return `{\\colorbox{${color}}{${tex}}}`;
}

export function active_socket_tex(tex: string): string {
    return add_color_box(tex, palette.socket_active_blue);
}

export function create_tex_text(text: string) {
    return `\\text{${text}}`;
}

export function text_with_cursor(
    text: string,
    cursor_position: number
): string {
    return create_tex_text(
        text.slice(0, cursor_position) +
            `\\htmlId{cursor}{|}` +
            text.slice(cursor_position)
    );
}

export function wrap_css_id(tex: string, css_id: string) {
    return `{\\htmlId{${css_id}}{${tex}}`;
}

export const LATEX_SPACE = "\\;";
export const LATEX_EMPTY_SOCKET = "□"; //"☐";

export const CURSOR_NAME = "cursor";
export const CURSOR_LATEX: string =
    "\\cssId{cursor}{\\color{black}{\\boldsymbol{|}}}";

export const ALLOWED_NON_ALPHA_NUMERIC_CHARS = [
    "/",
    "[",
    "]",
    "(",
    ")",
    ",",
    "<",
    ">",
    "-",
    "!",
    "*",
    "+",
    "=",
    "'",
    '"',
    ";",
    ":",
    "|",
];
