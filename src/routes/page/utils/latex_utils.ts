export function add_latex_color(tex: string, color: string) {
    return `{\\color{${color}}{${tex}}}`;
}

export function add_color_box(tex: string, color: string) {
    return `{\\color_box{${color}}{${tex}}}`;
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
            `\\cssId{cursor}{|}` +
            text.slice(cursor_position)
    );
}

export function wrap_css_id(tex: string, css_id: string) {
    return `{\\cssId{${css_id}}{${tex}}`;
}

export const LATEX_SPACE = "\\;";
