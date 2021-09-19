import React, { useContext } from "react";
import "./lambda_prop_styles.scss";
import ReducedForm from "../reduced_form";
import { LambdaPropType } from "../../../page_types/reduced_form/reduced_form";
import { PageContext } from "../../../page_context";
import TexElement from "../../tex_element/tex_element";

interface Props {
    lambda_prop: LambdaPropType;
}

const LambdaProp: React.FC<Props> = (props) => {
    const { lambda_prop } = props;
    const { select_socket, select_mode, select_seq } = useContext(PageContext);

    return (
        <div className="lambda-container">
            <div className="lam-header-container">
                <div className="lam-header-left">
                    <TexElement
                        tex={lambda_prop.intro_tex}
                        id_tex_widget_properties={
                            lambda_prop.intro_widget_properties
                        }
                        select_widget={select_socket}
                        show_widget_labels={select_mode}
                        select_seq={select_seq}
                    />
                </div>
                <div className="lam-header-right">
                    <div className="pg-label">
                        <TexElement
                            tex={lambda_prop.label}
                            id_tex_widget_properties={
                                lambda_prop.label_widget_properties
                            }
                            select_widget={select_socket}
                            show_widget_labels={select_mode}
                            select_seq={select_seq}
                        />
                    </div>
                    <div className="pg-index">({lambda_prop.pg_index})</div>
                </div>
            </div>
            <div className="lam-children-container">
                {lambda_prop.children.map((form) => (
                    <ReducedForm form={form} />
                ))}
            </div>
        </div>
    );
};

export default LambdaProp;
