import React, { useState } from "react";
import "../../prototype_styles.scss";
import MathJaxElement from "../../../../global_building_blocks/mathjax_element/mathjax_element";
import TwoColumn from "../two_column/two_column";

interface Props {
    content: string;
    goalTex: string[];
    finalTex: string;
    finalJustification: string;
    finalIndex: string;
}

const Strategy: React.FC<Props> = (props) => {
    const [showStrat, setStratVisible] = useState<boolean>(true);
    const [showBody, setBodyVisible] = useState<boolean>(false);

    return (
        <div className="strategy-container">
            <div className="strategy-header">
                <div className="header-left">
                    {showStrat && (
                        <>
                            <div className="strategy-title">Strategy:</div>
                            <div className="strategy-content">
                                {props.content}
                            </div>
                            <div className="goals-container">
                                <div className="goals-title">
                                    {props.goalTex.length === 1
                                        ? "Goal"
                                        : "Goals"}
                                    :
                                </div>
                                {props.goalTex.map((tex) => (
                                    <div className="goal-math">
                                        <MathJaxElement
                                            tex={tex}
                                            showTermHints={false}
                                            selectTerm={() => {}}
                                            termIds={[]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="header-right">
                    <div
                        className="hide-button"
                        onClick={() => setStratVisible((visible) => !visible)}
                    >
                        {showStrat ? "Hide strategy" : "Show strategy"}
                    </div>
                    <div
                        className="hide-button"
                        onClick={() => setBodyVisible((visible) => !visible)}
                    >
                        {showBody ? "Hide body" : "Show body"}
                    </div>
                </div>
            </div>
            <div className="strategy-bar" />
            {showBody && (
                <div className="strategy-children">{props.children}</div>
            )}
            <TwoColumn
                tex={`\\therefore \\; ${props.finalTex}`}
                justification={props.finalJustification}
                index={props.finalIndex}
            />
        </div>
    );
};

export default Strategy;
