import React, { useContext } from "react";
import "./inline_prop_styles.scss";
import { InlinePropType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../../../../global_building_blocks/tex_element/tex_element";
import { PageContext } from "../../../page_context";

interface Props {
    inline_prop: InlinePropType;
}

const InlineProp: React.FC<Props> = (props) => {
    const { inline_prop } = props;
    const { select_socket, select_mode, select_seq } = useContext(PageContext);

    return (
        <div className="inline-container">
            <div className="inline-left">
                <div className="inline-left-left">
                    <TexElement
                        tex={inline_prop.prop}
                        term_ids={inline_prop.prop_socket_ids}
                        select_socket={select_socket}
                        show_term_hints={select_mode}
                        select_seq={select_seq}
                    />
                </div>
                <div className="inline-left-right">
                    {inline_prop.explanation}
                </div>
            </div>
            <div className="inline-right">
                <div className="pg-label">
                    <TexElement
                        tex={inline_prop.label}
                        term_ids={inline_prop.label_socket_ids}
                        select_socket={select_socket}
                        show_term_hints={select_mode}
                        select_seq={select_seq}
                    />
                </div>
                <div className="pg-index">({inline_prop.pg_index})</div>
            </div>
        </div>
    );
};

export default InlineProp;
