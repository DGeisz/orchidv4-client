import React from "react";
import "./inline_prop_styles.scss";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";
import { InlinePropType } from "../../../page_types/reduced_form/reduced_form";

interface Props {
    inline_prop: InlinePropType;
}

const InlineProp: React.FC<Props> = (props) => {
    const { inline_prop } = props;

    return (
        <div className="inline-container">
            <div className="inline-left">
                <div className="inline-left-left">
                    <MathJaxElement tex={inline_prop.prop} termIds={[]} />
                </div>
                <div className="inline-left-right">
                    {inline_prop.explanation}
                </div>
            </div>
            <div className="inline-right">
                <div className="pg-label">{inline_prop.label}</div>
                <div className="pg-index">({inline_prop.pg_index})</div>
            </div>
        </div>
    );
};

export default InlineProp;
