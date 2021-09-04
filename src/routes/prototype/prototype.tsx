import React from "react";
import "./prototype_styles.scss";
import MathJaxElement from "../../global_building_blocks/mathjax_element/mathjax_element";
import Strategy from "./building_blocks/strategy/strategy";
import Lambda from "./building_blocks/lambda/lambda";
import TwoColumn from "./building_blocks/two_column/two_column";

const Prototype: React.FC = () => {
    return (
        <div className="contain">
            <div className="theorem-container">
                <div className="theorem-title">Theorem 1</div>
                <div className="theorem-math">
                    <MathJaxElement
                        tex="\left(\exists x,\; p(x) \wedge r\right) \Leftrightarrow \left(\exists x,\; p(x) \right) \wedge r"
                        showTermHints={false}
                        selectTerm={() => {}}
                        termIds={[]}
                    />
                </div>
            </div>
            <div className="proof-container">
                <div className="proof-title">Proof</div>
                <Strategy
                    content="Use equivalence introduction"
                    goalTex={[
                        `\\left(\\exists x,\\; p(x) \\wedge r\\right) \\Rightarrow \\left(\\exists x,\\; p(x) \\right) \\wedge r`,
                        "\\left(\\exists x,\\; p(x) \\right) \\wedge r \\Rightarrow \\left(\\exists x,\\; p(x) \\wedge r\\right)",
                    ]}
                    finalTex="\left(\exists x,\; p(x) \wedge r\right) \Leftrightarrow \left(\exists x,\; p(x) \right) \wedge r"
                    finalJustification="Using equivalence introduction with 1.1 and 1.12"
                    finalIndex="1.23"
                >
                    <Lambda
                        goal="\left(\exists x,\; p(x) \wedge r\right) \Rightarrow \left(\exists x,\; p(x) \right) \wedge r"
                        ant_type="\exists x,\; p(x) \wedge r"
                        ant_term=""
                        is_prop={true}
                        lam_index="1.1"
                        ant_index="1.2"
                    >
                        <Strategy
                            content="Use existential elimination with 1.2"
                            goalTex={[
                                "\\forall w \\; : \\; \\alpha, \\; p(w) \\wedge r \\Rightarrow \\left(\\exists x, \\; p(x) \\right) \\wedge r",
                            ]}
                            finalTex="\left(\exists x, \; p(x) \right) \wedge r"
                            finalJustification="Using existential elimination with 1.2, w, and 1.4"
                            finalIndex="1.100"
                        >
                            <Lambda
                                goal="\forall w \; : \; \alpha, \; p(w) \wedge r \Rightarrow \left(\exists x, \; p(x) \right) \wedge r"
                                ant_type="\alpha"
                                ant_term="w"
                                is_prop={false}
                                lam_index="1.4"
                                ant_index="1.5"
                            >
                                <Lambda
                                    goal="p(w) \wedge r \Rightarrow \left(\exists x, \; p(x) \right)"
                                    ant_type="p(w) \wedge r"
                                    ant_term=""
                                    is_prop={true}
                                    lam_index="1.6"
                                    ant_index="1.7"
                                >
                                    <TwoColumn
                                        tex="p(w)"
                                        justification="Applying left conjunctive elimination to 1.2"
                                        index="1.8"
                                    />
                                    <TwoColumn
                                        tex="\exists x, \; p(x)"
                                        justification="Using existential introduction with w and 1.3"
                                        index="1.9"
                                    />
                                    <TwoColumn
                                        tex="r"
                                        justification="Applying right conjunctive elimination on 1.2"
                                        index="1.10"
                                    />
                                    <TwoColumn
                                        tex="\left(\exists x, \; p(x)\right) \wedge r"
                                        justification="Using conjunctive introduction with 1.4 and 1.5"
                                        index="1.11"
                                    />
                                </Lambda>
                            </Lambda>
                        </Strategy>
                    </Lambda>
                    <Lambda
                        goal="\left(\exists x,\; p(x) \right) \wedge r \Rightarrow \left(\exists x,\; p(x) \wedge r\right)"
                        ant_type="\left(\exists x,\; p(x) \right) \wedge r"
                        ant_term=""
                        is_prop={true}
                        lam_index="1.12"
                        ant_index="1.13"
                    >
                        <TwoColumn
                            tex="\exists x,\; p(x)"
                            justification="Using left conjunctive elimination on 1.13"
                            index="1.14"
                        />
                        <Strategy
                            content="Using existential elimination with 1.14"
                            goalTex={[
                                "\\forall w \\; : \\; \\alpha,\\; p(w) \\Rightarrow \\left(\\exists x, \\; p(x) \\wedge r \\right)",
                            ]}
                            finalTex="\exists x,\; p(x) \wedge r"
                            finalJustification="Using existential elimination with 1.14 and 1.15"
                            finalIndex="1.22"
                        >
                            <Lambda
                                goal="\forall w \; : \; \alpha,\; p(w) \Rightarrow \left(\exists x, \; p(x) \wedge r \right)"
                                ant_type="\alpha"
                                ant_term="w"
                                is_prop={false}
                                lam_index="1.15"
                                ant_index="1.16"
                            >
                                <Lambda
                                    goal="p(w) \Rightarrow \left(\exists x, \; p(x) \wedge r \right)"
                                    ant_type="p(w)"
                                    ant_term=""
                                    is_prop={true}
                                    lam_index="1.17"
                                    ant_index="1.18"
                                >
                                    <TwoColumn
                                        tex="r"
                                        justification="Applying right conjunctive elimination on 1.13"
                                        index="1.19"
                                    />
                                    <TwoColumn
                                        tex="p(w) \wedge r"
                                        justification="Using conjunctive introduction with 1.18 and 1.19"
                                        index="1.20"
                                    />
                                    <TwoColumn
                                        tex="\exists x, \; p(x) \wedge r"
                                        justification="Using existential introduction with w and 1.21"
                                        index="1.21"
                                    />
                                </Lambda>
                            </Lambda>
                        </Strategy>
                    </Lambda>
                </Strategy>
            </div>
        </div>
    );
};

export default Prototype;
