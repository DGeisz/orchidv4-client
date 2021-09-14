import React, { useContext } from "react";
import "./tex_line_styles.scss";
import { TexLineType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../../../../global_building_blocks/tex_element/tex_element";
import { PageContext } from "../../../page_context";

interface Props {
    tex_line: TexLineType;
}

const TexLine: React.FC<Props> = (props) => {
    const { select_socket, select_mode, select_seq } = useContext(PageContext);
    const { tex, socket_ids } = props.tex_line;

    return (
        <div className="tex-container">
            <TexElement
                tex={tex}
                term_ids={socket_ids}
                select_socket={select_socket}
                show_term_hints={select_mode}
                select_seq={select_seq}
            />
        </div>
    );
};

export default TexLine;
