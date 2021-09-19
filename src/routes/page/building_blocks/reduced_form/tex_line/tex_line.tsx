import React, { useContext } from "react";
import "./tex_line_styles.scss";
import { TexLineType } from "../../../page_types/reduced_form/reduced_form";
import { PageContext } from "../../../page_context";
import TexElement from "../../tex_element/tex_element";

interface Props {
    tex_line: TexLineType;
}

const TexLine: React.FC<Props> = (props) => {
    const { select_socket, select_mode, select_seq } = useContext(PageContext);
    const { tex, tex_widget_properties } = props.tex_line;

    return (
        <div className="tex-container">
            <TexElement
                tex={tex}
                id_tex_widget_properties={tex_widget_properties}
                select_widget={select_socket}
                show_widget_labels={select_mode}
                select_seq={select_seq}
            />
        </div>
    );
};

export default TexLine;
