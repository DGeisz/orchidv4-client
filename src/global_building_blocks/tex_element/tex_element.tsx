import React, { useEffect, useState } from "react";
import "./tex_element_styles.scss";
import { hint_strings } from "../../global_utils/vimium_hints";
import { renderToString } from "katex";

const HOVER_COLOR = "#8fcad9";

interface MiniProps {
    tex: string;
}

const MiniTex = React.memo<MiniProps>((props) => {
    return (
        <div
            className="tex-container-tex"
            dangerouslySetInnerHTML={{
                __html: renderToString(props.tex, {
                    trust: true,
                    displayMode: true,
                    output: "html",
                    strict: false,
                }),
            }}
        />
    );
});

interface Props {
    tex: string;
    term_ids: string[];
    select_socket?: (id: string) => void;
    show_term_hints?: boolean;
}

const TexElement: React.FC<Props> = (props) => {
    const [termHints, setTermHints] = useState<HTMLDivElement[]>([]);

    useEffect(() => {
        props.term_ids.forEach((id) => {
            let tex_node = document.getElementById(id);

            if (!!tex_node) {
                const og_color = tex_node.style.backgroundColor;

                tex_node.style.transition = "all 100ms ease-in-out";
                tex_node.style.cursor = "pointer";
                tex_node.style.position = "relative";

                tex_node.onmousedown = () =>
                    !!props.select_socket && props.select_socket(id);

                tex_node.onmouseover = () => {
                    if (!!tex_node) {
                        tex_node.style.color = HOVER_COLOR;
                    }
                };

                tex_node.onmouseleave = () => {
                    if (!!tex_node) {
                        tex_node.style.color = og_color;
                    }
                };
            }
        });
    });

    useEffect(() => {
        termHints.forEach((hint) => hint.remove());

        if (!!props.show_term_hints) {
            const hints = hint_strings(props.term_ids.length);
            const newTermHints: HTMLDivElement[] = [];

            props.term_ids.forEach((id, index) => {
                let tex_node = document.getElementById(id);

                if (!!tex_node) {
                    const domHint = genTermHint(hints[index]);
                    tex_node.appendChild(domHint);
                    newTermHints.push(domHint);
                }
            });

            setTermHints(newTermHints);
        }
    }, [props.show_term_hints, props.tex, props.term_ids]);

    return <MiniTex tex={props.tex} />;
};

export default React.memo(TexElement, (jax1, jax2) => {
    return (
        jax1.tex === jax2.tex && jax1.show_term_hints === jax2.show_term_hints
    );
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
