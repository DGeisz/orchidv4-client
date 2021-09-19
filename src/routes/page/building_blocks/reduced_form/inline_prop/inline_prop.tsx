import React from "react";
import "./inline_prop_styles.scss";
import { InlinePropType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../tex_element/tex_element";

interface Props {
    inline_prop: InlinePropType;
}

const InlineProp: React.FC<Props> = (props) => {
    const { inline_prop } = props;

    return (
        <div className="inline-container">
            <div className="inline-left">
                <div className="inline-left-left">
                    <TexElement
                        tex={inline_prop.prop}
                        tex_widget_properties={
                            inline_prop.prop_widget_properties
                        }
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
                        tex_widget_properties={
                            inline_prop.label_widget_properties
                        }
                    />
                </div>
                <div className="pg-index">({inline_prop.pg_index})</div>
            </div>
        </div>
    );
};

export default InlineProp;
