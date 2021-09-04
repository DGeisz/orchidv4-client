import React, { useState } from "react";
import "../../prototype_styles.scss";
import Proposition from "../proposition/proposition";
import MathJaxElement from "../../../../global_building_blocks/mathjax_element/mathjax_element";

interface Props {
    goal: string;
    ant_type: string;
    ant_term: string;
    is_prop: boolean;
    lam_index: string;
    ant_index: string;
}

const Lambda: React.FC<Props> = (props) => {
    const [showBody, setBodyVisible] = useState<boolean>(false);

    return (
        <div className="prop-lambda-container">
            <div className="prop-lambda-goal">
                <Proposition
                    tex={`\\vdash ${props.goal}`}
                    index={props.lam_index}
                />
            </div>
            <div
                className="hide-button"
                onClick={() => setBodyVisible((visible) => !visible)}
            >
                {showBody ? "Hide body" : "Show body"}
            </div>
            <div className="prop-lambda-assumption">
                {props.is_prop ? (
                    <Proposition
                        tex={`\\text{Assume} \\; ${props.ant_type}`}
                        index={props.ant_index}
                    />
                ) : (
                    <Proposition
                        tex={`\\text{Given} \\; ${props.ant_term} \\; : \\; ${props.ant_type}`}
                        index={props.ant_index}
                    />
                )}
            </div>

            <div className="strategy-bar" />
            {showBody && (
                <div className="prop-lambda-children">{props.children}</div>
            )}
            <div className="lam-conclusion">
                <MathJaxElement
                    tex={`\\therefore \\; ${props.goal}`}
                    showTermHints={false}
                    selectTerm={() => {}}
                    termIds={[]}
                />
            </div>
        </div>
    );
};

export default Lambda;
