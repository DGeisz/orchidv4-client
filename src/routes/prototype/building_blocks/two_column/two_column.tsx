import React from "react";
import TexElement from "../../../../global_building_blocks/tex_element/tex_element";

interface Props {
    tex: string;
    justification: string;
    index: string;
}

const TwoColumn: React.FC<Props> = (props) => {
    return (
        <div className="two-column-container">
            <div className="two-column-left">
                <div className="two-left-left">
                    <TexElement
                        tex={props.tex}
                        showTermHints={false}
                        selectTerm={() => {}}
                        termIds={[]}
                    />
                </div>
                <div className="two-left-right">{props.justification}</div>
            </div>
            <div className="two-column-right">({props.index})</div>
        </div>
    );
};

export default TwoColumn;
