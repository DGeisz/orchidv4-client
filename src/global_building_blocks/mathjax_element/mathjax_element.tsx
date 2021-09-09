import React, { useEffect, useState } from "react";
import "./mathjax_element_styles.scss";
import { convert_latex } from "../../global_utils/mathjax_utils";
import { hint_strings } from "../../global_utils/vimium_hints";

const HOVER_COLOR = "#8fcad9";

interface Props {
    tex: string;
    termIds: string[];
    selectTerm?: (id: string) => void;
    showTermHints?: boolean;
}

const MathJaxElement: React.FC<Props> = (props) => {
    const [termHints, setTermHints] = useState<HTMLDivElement[]>([]);

    useEffect(() => {
        props.termIds.forEach((id) => {
            let jax_node = document.getElementById(id);

            if (!!jax_node) {
                const og_color = jax_node.style.backgroundColor;

                jax_node.style.transition = "all 100ms ease-in-out";
                jax_node.style.cursor = "pointer";
                jax_node.style.position = "relative";

                jax_node.onmousedown = () =>
                    !!props.selectTerm && props.selectTerm(id);

                jax_node.onmouseover = () => {
                    if (!!jax_node) {
                        jax_node.style.color = HOVER_COLOR;
                    }
                };

                jax_node.onmouseleave = () => {
                    if (!!jax_node) {
                        jax_node.style.color = og_color;
                    }
                };
            }
        });
    });

    useEffect(() => {
        termHints.forEach((hint) => hint.remove());

        if (!!props.showTermHints) {
            const hints = hint_strings(props.termIds.length);
            const newTermHints: HTMLDivElement[] = [];

            props.termIds.forEach((id, index) => {
                let jax_node = document.getElementById(id);

                if (!!jax_node) {
                    const domHint = genTermHint(hints[index]);
                    jax_node.appendChild(domHint);
                    newTermHints.push(domHint);
                }
            });

            setTermHints(newTermHints);
        }
    }, [props.showTermHints, props.tex, props.termIds]);

    return (
        <div dangerouslySetInnerHTML={{ __html: convert_latex(props.tex) }} />
    );
};

export default React.memo(MathJaxElement, (jax1, jax2) => {
    return jax1.tex === jax2.tex && jax1.showTermHints === jax2.showTermHints;
});

export function genTermHint(hint: string): HTMLDivElement {
    const hintContainer = document.createElement("div");
    hintContainer.className = "term-hint-container";

    const hintBox = document.createElement("div");
    hintBox.className = "term-hint";
    hintBox.innerText = hint;

    hintContainer.appendChild(hintBox);

    return hintContainer;
}
