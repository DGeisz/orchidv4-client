import React from "react";
import "./tex_widget_styles.scss";
import { TexWidgetProperties } from "./tex_widget_types/tex_widget_types";

interface Props {
    show_label: boolean;
    select_seq: string;
    properties: TexWidgetProperties;
}

const TexWidget: React.FC<Props> = (props) => {
    const { properties } = props;

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
    }

    return null;
};

export default TexWidget;
