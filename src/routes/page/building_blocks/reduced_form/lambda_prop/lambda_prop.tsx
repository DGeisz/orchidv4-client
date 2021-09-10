import React from "react";
import "./lambda_prop_styles.scss";
import ReducedForm from "../reduced_form";
import { LambdaPropType } from "../../../page_types/reduced_form/reduced_form";
import TexElement from "../../../../../global_building_blocks/tex_element/tex_element";

interface Props {
    lambda_prop: LambdaPropType;
}

const LambdaProp: React.FC<Props> = (props) => {
    const { lambda_prop } = props;

    return (
        <div className="lambda-container">
            <div className="lam-header-container">
                <div className="lam-header-left">
                    <TexElement tex={lambda_prop.intro_tex} termIds={[]} />
                </div>
                <div className="lam-header-right">
                    <div className="pg-label">{lambda_prop.label}</div>
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
