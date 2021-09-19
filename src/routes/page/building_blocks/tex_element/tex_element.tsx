import React, { useContext, useEffect, useState } from "react";
import { render } from "react-dom";
import "./tex_element_styles.scss";
import { element_in_view } from "../../utils/dom_utils";
import { palette } from "../../../../global_styles/palette";
import TexWidget from "./building_blocks/tex_widget/tex_widget";
import MiniTex from "./building_blocks/mini_tex/mini_tex";
import { TexWidgetProperties } from "./building_blocks/tex_widget/tex_widget_types/tex_widget_types";
import { PageContext } from "../../page_context";

interface Props {
    tex: string;
    tex_widget_properties: TexWidgetProperties[];
}

const TexElement: React.FC<Props> = (props) => {
    const {
        select_seq,
        select_mode: show_widget_labels,
        select_socket: select_widget,
        edit_rep_id,
        edit_rep_mode: edit_rep,
        page_id,
    } = useContext(PageContext);

    const [widget_containers, set_widget_containers] = useState<
        HTMLDivElement[]
    >([]);

    useEffect(() => {
        props.tex_widget_properties.forEach((widget) => {
            let tex_node = document.getElementById(widget.id);

            if (!!tex_node && (!edit_rep || edit_rep_id !== widget.id)) {
                const og_color = tex_node.style.backgroundColor;

                tex_node.style.transition = "all 100ms ease-in-out";
                tex_node.style.cursor = "pointer";
                tex_node.style.position = "relative";

                tex_node.onmousedown = () =>
                    !!select_widget && select_widget(widget.id);

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

        props.tex_widget_properties.forEach((tex_widget) => {
            let tex_node = document.getElementById(tex_widget.id);

            if (!!tex_node && element_in_view(tex_node)) {
                const widget_container = create_widget_container();
                tex_node.appendChild(widget_container);

                render(
                    <TexWidget
                        show_label={show_widget_labels}
                        select_seq={select_seq}
                        edit_rep={edit_rep}
                        edit_rep_id={edit_rep_id}
                        page_id={page_id}
                        properties={tex_widget}
                    />,
                    widget_container
                );

                new_containers.push(widget_container);
            }

            if (select_seq === tex_widget.label) {
                !!select_widget && select_widget(tex_widget.id);
            }
        });

        set_widget_containers(new_containers);
    }, [
        show_widget_labels,
        props.tex_widget_properties,
        props.tex,
        select_seq,
    ]);

    return <MiniTex tex={props.tex} />;
};

export default React.memo(TexElement, (tex1, tex2) => {
    return (
        tex1.tex === tex2.tex &&
        tex1.tex_widget_properties === tex2.tex_widget_properties
    );
});

export function create_widget_container() {
    const widget_container = document.createElement("div");
    widget_container.className = "widget-container";

    return widget_container;
}
