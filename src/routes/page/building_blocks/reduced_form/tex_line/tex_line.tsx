import React from "react";
import "./tex_line_styles.scss";
import { TexLineType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../tex_element/tex_element";

interface Props {
    tex_line: TexLineType;
}

const TexLine: React.FC<Props> = (props) => {
    const { tex, tex_widget_properties } = props.tex_line;

    return (
        <div className="tex-container">
            <TexElement
                tex={tex}
                tex_widget_properties={tex_widget_properties}
            />
        </div>
    );
};

export default TexLine;
