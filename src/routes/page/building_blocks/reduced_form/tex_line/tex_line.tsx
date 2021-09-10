import React from "react";
import "./tex_line_styles.scss";
import { TexLineType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../../../../global_building_blocks/tex_element/tex_element";

interface Props {
    tex_line: TexLineType;
}

const TexLine: React.FC<Props> = (props) => {
    return (
        <div className="tex-container">
            <TexElement tex={props.tex_line.tex} termIds={[]} />
        </div>
    );
};

export default TexLine;
