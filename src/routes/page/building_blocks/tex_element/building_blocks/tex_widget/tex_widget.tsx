import React, { useEffect, useRef, useState } from "react";
import "./tex_widget_styles.scss";
import { TexWidgetProperties } from "./tex_widget_types/tex_widget_types";
import MiniTex from "../mini_tex/mini_tex";
import { kernel_link } from "../../../../../../kernel_link/kernel_link";
import {
    add_color_box,
    create_tex_text,
    LATEX_NAME,
    LATEX_SPACE,
    tex_renders_properly,
} from "../../../../utils/latex_utils";
import { palette } from "../../../../../../global_styles/palette";

interface Props {
    show_label: boolean;
    select_seq: string;
    edit_rep: boolean;
    edit_rep_id: string;
    page_id: string;
    properties: TexWidgetProperties;
}

const TexWidget: React.FC<Props> = (props) => {
    const { properties } = props;

    const container_ref = useRef<HTMLDivElement>(null);

    const [rep_tex, set_rep_tex] = useState<string>(
        !!properties.term_representation ? properties.term_representation : ""
    );

    const [tex_renders, set_renders] = useState<boolean>(
        tex_renders_properly(rep_tex)
    );

    const [left_offset, set_left_offset] = useState<number>(0);

    useEffect(() => {
        if (!!container_ref.current) {
            const rect = container_ref.current.getBoundingClientRect();

            const window_width =
                window.innerWidth || document.documentElement.clientWidth;
            console.log(
                "Here we go: ",
                container_ref.current.offsetWidth,
                document.documentElement.clientWidth,
                rect.right
            );

            if (rect.right > window_width) {
                set_left_offset(rect.right - window_width + 20);
            }
        }
    }, [container_ref]);

    if (props.show_label) {
        let left: string;
        let right: string;

        if (properties.label.startsWith(props.select_seq)) {
            left = props.select_seq;
            right = properties.label.substring(props.select_seq.length);
        } else {
            left = "";
            right = properties.label;
        }

        return (
            <div className="term-hint-container">
                <div className="term-hint">
                    <span className="term-left">{left}</span>
                    <span className="term-right">{right}</span>
                </div>
            </div>
        );
    } else if (
        props.edit_rep &&
        props.edit_rep_id === properties.id &&
        !!properties.term_seq &&
        !!properties.term_representation
    ) {
        return (
            <>
                <div className="outer-rep-container">
                    <div className="rep-buffer" />
                    <div className="rep-lower">
                        <div
                            className="rep-container"
                            style={{ left: -15 - left_offset }}
                            ref={container_ref}
                        >
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (
                                        !!rep_tex &&
                                        tex_renders_properly(rep_tex)
                                    ) {
                                        /*TODO: Create kernel link set rep method*/
                                        kernel_link.set_tds_rep(
                                            props.page_id,
                                            properties.id,
                                            rep_tex
                                        );
                                    }
                                }}
                            >
                                <input
                                    autoFocus
                                    className="rep-tex-input"
                                    value={rep_tex}
                                    onChange={(e) => {
                                        set_renders(
                                            tex_renders_properly(e.target.value)
                                        );
                                        set_rep_tex(e.target.value);
                                    }}
                                />
                            </form>
                            <div className="rendered-tex">
                                <MiniTex
                                    tex={
                                        tex_renders
                                            ? rep_tex
                                            : add_color_box(
                                                  `${create_tex_text(
                                                      "Invalid"
                                                  )} ${LATEX_SPACE} ${LATEX_NAME}`,
                                                  palette.danger_hover
                                              )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return null;
};

export default TexWidget;
