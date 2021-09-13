import React, { useState } from "react";
import "./global_header_styles.scss";
import "../../../page_styles.scss";
import ReducedForm from "../reduced_form";
import { GlobalHeaderType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../../../../global_building_blocks/tex_element/tex_element";

interface Props {
    global_header: GlobalHeaderType;
}

const GlobalHeader: React.FC<Props> = (props) => {
    const { global_header } = props;

    const [show_proof, set_proof_visible] = useState<boolean>(true);

    return (
        <div className="gh-outer-container">
            {global_header.left_cursor_active && (
                <div className="gh-left-cursor" id={"cursor"} />
            )}
            <div
                className="gh-container"
                style={{ backgroundColor: global_header.background_color }}
            >
                <div className="gh-header">
                    <div className="gh-title-container">
                        <div
                            className="gh-title"
                            style={{ color: global_header.title_color }}
                        >
                            {global_header.title}
                        </div>
                    </div>
                    <div className="gh-content">
                        <div className="gh-content-left">
                            <TexElement
                                tex={global_header.main_tex}
                                termIds={[]}
                            />
                        </div>
                        <div className="gh-content-right">
                            <div className="pg-label">
                                <TexElement
                                    tex={global_header.label}
                                    termIds={[]}
                                />
                            </div>
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
            {global_header.right_cursor_active && (
                <div className="gh-right-cursor" id="cursor" />
            )}
        </div>
    );
};

export default GlobalHeader;
