import React, { useContext, useState } from "react";
import "./surround_index_styles.scss";
import ReducedForm from "../reduced_form";
import { SurroundIndentType } from "../../../page_types/reduced_form/reduced_form";
import { PageContext } from "../../../page_context";
import TexElement from "../../tex_element/tex_element";

interface Props {
    surround_indent: SurroundIndentType;
}

const SurroundIndent: React.FC<Props> = (props) => {
    const { surround_indent } = props;
    const { select_socket, select_mode, select_seq } = useContext(PageContext);

    const [body_visible, show_body] = useState<boolean>(true);

    return (
        <div className="si-container">
            <div className="si-header">
                <div className="si-header-left">
                    <TexElement
                        tex={surround_indent.header_tex}
                        id_tex_widget_properties={
                            surround_indent.header_widget_properties
                        }
                        select_widget={select_socket}
                        show_widget_labels={select_mode}
                        select_seq={select_seq}
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
                        id_tex_widget_properties={
                            surround_indent.footer_widget_properties
                        }
                        select_widget={select_socket}
                        show_widget_labels={select_mode}
                        select_seq={select_seq}
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
