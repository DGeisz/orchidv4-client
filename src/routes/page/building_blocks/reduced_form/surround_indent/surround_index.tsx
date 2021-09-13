import React, { useContext, useState } from "react";
import "./surround_index_styles.scss";
import ReducedForm from "../reduced_form";
import { SurroundIndentType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../../../../global_building_blocks/tex_element/tex_element";
import { PageContext } from "../../../page_context";

interface Props {
    surround_indent: SurroundIndentType;
}

const SurroundIndent: React.FC<Props> = (props) => {
    const { surround_indent } = props;
    const { select_socket } = useContext(PageContext);

    const [body_visible, show_body] = useState<boolean>(true);

    return (
        <div className="si-container">
            <div className="si-header">
                <div className="si-header-left">
                    <TexElement
                        tex={surround_indent.header_tex}
                        term_ids={surround_indent.header_socket_ids}
                        select_socket={select_socket}
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
                    <TexElement
                        tex={surround_indent.footer_tex}
                        term_ids={surround_indent.footer_socket_ids}
                        select_socket={select_socket}
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
