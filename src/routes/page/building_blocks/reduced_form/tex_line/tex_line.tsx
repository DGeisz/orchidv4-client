import React from "react";
import "./tex_line_styles.scss";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";
import { TexLineType } from "../../../page_types/reduced_form/reduced_form";

interface Props {
    tex_line: TexLineType;
}

const TexLine: React.FC<Props> = (props) => {
    return (
        <div className="tex-container">
            <MathJaxElement tex={props.tex_line.tex} termIds={[]} />
        </div>
    );
};

export default TexLine;
