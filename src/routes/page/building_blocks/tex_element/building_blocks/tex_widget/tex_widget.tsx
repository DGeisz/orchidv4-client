import React, { useState } from "react";
import "./tex_widget_styles.scss";
import { TexWidgetProperties } from "./tex_widget_types/tex_widget_types";
import MiniTex from "../mini_tex/mini_tex";

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

    const [rep_tex, set_rep_tex] = useState<string>(
        !!properties.term_representation ? properties.term_representation : ""
    );

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
                        <div className="rep-container">
                            <input
                                autoFocus
                                className="rep-tex-input"
                                value={rep_tex}
                                onChange={(e) => set_rep_tex(e.target.value)}
                                onSubmit={() => {
                                    if (!!rep_tex) {
                                        /*TODO: Create kernel link set rep method*/
                                    }
                                }}
                            />
                            <div className="rendered-tex">
                                <MiniTex tex={rep_tex} />
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
