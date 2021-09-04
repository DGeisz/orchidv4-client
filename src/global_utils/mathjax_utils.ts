declare global {
    interface Window {
        MathJax: any;
    }
}

export function convert_latex(tex: string): string {
    const node = window.MathJax.tex2chtml(tex);

    window.MathJax.startup.document.clear();
    window.MathJax.startup.document.updateDocument();

    return node.outerHTML;
}
