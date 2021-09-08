import React, { useState } from "react";
import "./surround_index_styles.scss";
import { SurroundIndentType } from "../../../reduced_form/reduced_form";
import ReducedForm from "../reduced_form";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";

interface Props {
    surround_indent: SurroundIndentType;
}

const SurroundIndent: React.FC<Props> = (props) => {
    const { surround_indent } = props;

    const [body_visible, show_body] = useState<boolean>(true);

    return (
        <div className="si-container">
            <div className="si-header">
                <div className="si-header-left">
                    <MathJaxElement
                        tex={surround_indent.header_tex}
                        termIds={[]}
                    />
                </div>
                <div className="si-header-right">
                    {body_visible && (
                        <div
                            className="hide-button"
                            onClick={() => show_body(false)}
                        >
                            Hide {surround_indent.body_name}
                        </div>
                    )}
                </div>
            </div>
            <div className="si-body">
                {body_visible ? (
                    <div className="children-container">
                        {surround_indent.children.map((form) => (
                            <ReducedForm form={form} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="show-button"
                        onClick={() => show_body(true)}
                    >
                        Show {surround_indent.body_name}
                    </div>
                )}
            </div>
            <div className="si-footer">
                <div className="si-footer-left">
                    <MathJaxElement
                        tex={surround_indent.footer_tex}
                        termIds={[]}
                    />
                </div>
                <div className="si-footer-right">
                    {!!surround_indent.label && (
                        <div className="pg-label">{surround_indent.label}</div>
                    )}
                    {!!surround_indent.pg_index && (
                        <div className="pg-index">
                            ({surround_indent.pg_index})
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurroundIndent;