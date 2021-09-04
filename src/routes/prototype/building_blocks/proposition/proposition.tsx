import React from "react";
import "../../prototype_styles.scss";
import MathJaxElement from "../../../../global_building_blocks/mathjax_element/mathjax_element";

interface Props {
    tex: string;
    index: string;
}

const Proposition: React.FC<Props> = (props) => {
    return (
        <div className="prop-container">
            <div className="prop-math">
                <MathJaxElement
                    tex={props.tex}
                    showTermHints={false}
                    selectTerm={() => {}}
                    termIds={[]}
                />
            </div>
            <div className="prop-index">({props.index})</div>
        </div>
    );
};

export default Proposition;
