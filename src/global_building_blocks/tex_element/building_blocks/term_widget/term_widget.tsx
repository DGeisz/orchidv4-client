import React from "react";
import "./term_widget_styles.scss";

interface Props {
    show_hint: boolean;
    hint_seq: string;
    select_seq: string;
}

const TermWidget: React.FC<Props> = (props) => {
    if (props.show_hint) {
        let left: string;
        let right: string;

        if (props.hint_seq.startsWith(props.select_seq)) {
            left = props.select_seq;
            right = props.hint_seq.substring(props.select_seq.length);
        } else {
            left = "";
            right = props.hint_seq;
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

export default TermWidget;
