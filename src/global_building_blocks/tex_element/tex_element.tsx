import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import "./tex_element_styles.scss";
import { renderToString } from "katex";
import { SocketId } from "../../routes/page/page_types/reduced_form/reduced_form";
import TermWidget from "./building_blocks/term_widget/term_widget";

const HOVER_COLOR = "#8fcad9";

const BigRed: React.FC = () => {
    return (
        <div
            style={{
                position: "absolute",
                opacity: 0.5,
                width: 100,
                height: 100,
                backgroundColor: "red",
            }}
        />
    );
};

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
    term_ids: SocketId[];
    select_socket?: (id: string) => void;
    show_term_hints?: boolean;
    select_seq: string;
}

const TexElement: React.FC<Props> = (props) => {
    // const [termHints, setTermHints] = useState<HTMLDivElement[]>([]);
    const [widget_containers, set_widget_containers] = useState<
        HTMLDivElement[]
    >([]);

    useEffect(() => {
        console.log("Here's seq", props.select_seq);
    }, [props.select_seq]);

    useEffect(() => {
        props.term_ids.forEach((socket_id) => {
            let tex_node = document.getElementById(socket_id.id);

            if (!!tex_node) {
                const og_color = tex_node.style.backgroundColor;

                tex_node.style.transition = "all 100ms ease-in-out";
                tex_node.style.cursor = "pointer";
                tex_node.style.position = "relative";

                tex_node.onmousedown = () =>
                    !!props.select_socket && props.select_socket(socket_id.id);

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
        // props.term_ids.forEach((socket_id) => {
        //     const element = document.getElementById(socket_id.id);
        //
        //     if (!!element) {
        //         render(<BigRed />, element);
        //     }
        // });

        widget_containers.forEach((container) => container.remove());

        // termHints.forEach((hint) => hint.remove());

        if (!!props.show_term_hints) {
            const new_containers: HTMLDivElement[] = [];

            props.term_ids.forEach((socket_id) => {
                let tex_node = document.getElementById(socket_id.id);

                if (!!tex_node) {
                    const widget_container = create_widget_container();
                    tex_node.appendChild(widget_container);

                    render(
                        <TermWidget
                            show_hint
                            hint_seq={socket_id.label}
                            select_seq={props.select_seq}
                        />,
                        widget_container
                    );

                    new_containers.push(widget_container);
                }

                if (props.select_seq === socket_id.label) {
                    !!props.select_socket && props.select_socket(socket_id.id);
                }
            });

            set_widget_containers(new_containers);
        }
    }, [props.show_term_hints, props.tex, props.term_ids, props.select_seq]);

    return <MiniTex tex={props.tex} />;
};

export default React.memo(TexElement, (jax1, jax2) => {
    return (
        jax1.tex === jax2.tex &&
        jax1.show_term_hints === jax2.show_term_hints &&
        jax1.select_seq === jax2.select_seq
    );
});

export function create_widget_container() {
    const widget_container = document.createElement("div");
    widget_container.className = "widget-container";

    return widget_container;
}

export function genTermHint(hint: string, select_seq: string): HTMLDivElement {
    const hintContainer = document.createElement("div");
    hintContainer.className = "term-hint-container";

    const hintBox = document.createElement("div");
    hintBox.className = "term-hint";
    // hintBox.innerText = hint;

    let left: string;
    let right: string;

    if (hint.startsWith(select_seq)) {
        left = select_seq;
        right = hint.substring(select_seq.length);
    } else {
        left = "";
        right = hint;
    }

    const hintLeft = document.createElement("span");
    hintLeft.className = "term-left";
    hintLeft.innerText = left;

    const hintRight = document.createElement("span");
    hintRight.className = "term-right";
    hintRight.innerText = right;

    hintBox.appendChild(hintLeft);
    hintBox.appendChild(hintRight);

    hintContainer.appendChild(hintBox);

    return hintContainer;
}
