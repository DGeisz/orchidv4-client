import React from "react";
import "../../prototype_styles.scss";
import TexElement from "../../../../global_building_blocks/tex_element/tex_element";

interface Props {
    tex: string;
    index: string;
}

const Proposition: React.FC<Props> = (props) => {
    return (
        <div className="prop-container">
            <div className="prop-math">
                <TexElement
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
