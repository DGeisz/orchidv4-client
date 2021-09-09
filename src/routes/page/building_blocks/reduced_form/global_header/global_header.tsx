import React, { useState } from "react";
import "./global_header_styles.scss";
import "../../../page_styles.scss";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";
import ReducedForm from "../reduced_form";
import { GlobalHeaderType } from "../../../page_types/reduced_form/reduced_form";

interface Props {
    global_header: GlobalHeaderType;
}

const GlobalHeader: React.FC<Props> = (props) => {
    const { global_header } = props;

    const [show_proof, set_proof_visible] = useState<boolean>(true);

    return (
        <div className="gh-container">
            <div className="gh-header">
                <div
                    className="gh-title"
                    style={{ color: global_header.title_color }}
                >
                    {global_header.title}
                </div>
                <div className="gh-content">
                    <div className="gh-content-left">
                        <MathJaxElement
                            tex={global_header.main_tex}
                            termIds={[]}
                        />
                    </div>
                    <div className="gh-content-right">
                        <div className="pg-label">{global_header.label}</div>
                        <div className="pg-index">
                            ({global_header.pg_index})
                        </div>
                    </div>
                </div>
                {global_header.children.length > 0 && (
                    <div
                        className={`proof-container ${
                            show_proof ? "proof-bar" : ""
                        }`}
                    >
                        {show_proof ? (
                            <>
                                <div className="gh-proof-title">Proof</div>
                                <div
                                    className="hide-button"
                                    onClick={() => set_proof_visible(false)}
                                >
                                    Hide proof
                                </div>
                            </>
                        ) : (
                            <div
                                className="show-button"
                                onClick={() => set_proof_visible(true)}
                            >
                                Show proof
                            </div>
                        )}
                    </div>
                )}
            </div>
            {show_proof && (
                <div className="gh-children-container">
                    {global_header.children.map((form) => (
                        <ReducedForm form={form} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GlobalHeader;
