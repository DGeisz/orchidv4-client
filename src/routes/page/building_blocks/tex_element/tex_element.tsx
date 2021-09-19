import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import "./tex_element_styles.scss";
import { renderToString } from "katex";
import { element_in_view } from "../../utils/dom_utils";
import { palette } from "../../../../global_styles/palette";
import TexWidget from "./building_blocks/tex_widget/tex_widget";
import { IdTexWidgetProperties } from "./tex_types/tex_types";

interface Props {
    tex: string;
    id_tex_widget_properties: IdTexWidgetProperties[];
    select_widget: (id: string) => void;
    show_widget_labels: boolean;
    select_seq: string;
}

const MiniTex = React.memo<{ tex: string }>((props) => {
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

const TexElement: React.FC<Props> = (props) => {
    const [widget_containers, set_widget_containers] = useState<
        HTMLDivElement[]
    >([]);

    useEffect(() => {
        props.id_tex_widget_properties.forEach((widget) => {
            let tex_node = document.getElementById(widget.id);

            if (!!tex_node) {
                const og_color = tex_node.style.backgroundColor;

                tex_node.style.transition = "all 100ms ease-in-out";
                tex_node.style.cursor = "pointer";
                tex_node.style.position = "relative";

                tex_node.onmousedown = () =>
                    !!props.select_widget && props.select_widget(widget.id);

                tex_node.onmouseover = () => {
                    if (!!tex_node) {
                        tex_node.style.color = palette.term_hover;
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
        widget_containers.forEach((container) => container.remove());

        const new_containers: HTMLDivElement[] = [];

        props.id_tex_widget_properties.forEach((tex_widget) => {
            let tex_node = document.getElementById(tex_widget.id);

            if (!!tex_node && element_in_view(tex_node)) {
                const widget_container = create_widget_container();
                tex_node.appendChild(widget_container);

                render(
                    <TexWidget
                        show_label={props.show_widget_labels}
                        select_seq={props.select_seq}
                        properties={tex_widget.properties}
                    />,
                    widget_container
                );

                new_containers.push(widget_container);
            }

            if (props.select_seq === tex_widget.properties.label) {
                !!props.select_widget && props.select_widget(tex_widget.id);
            }
        });

        set_widget_containers(new_containers);
    }, [
        props.show_widget_labels,
        props.id_tex_widget_properties,
        props.tex,
        props.select_seq,
    ]);

    return <MiniTex tex={props.tex} />;
};

export default React.memo(TexElement, (jax1, jax2) => {
    return (
        jax1.tex === jax2.tex &&
        jax1.id_tex_widget_properties === jax2.id_tex_widget_properties &&
        jax1.show_widget_labels === jax2.show_widget_labels &&
        jax1.select_seq === jax2.select_seq
    );
});

export function create_widget_container() {
    const widget_container = document.createElement("div");
    widget_container.className = "widget-container";

    return widget_container;
}
