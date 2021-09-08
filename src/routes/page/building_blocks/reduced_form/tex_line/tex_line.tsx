import React from "react";
import "./tex_line_styles.scss";
import { TexLineType } from "../../../reduced_form/reduced_form";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";

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
