import React from "react";
import { InlinePropType } from "../../reduced_form/reduced_form";

interface Props {
    inline_prop: InlinePropType;
}

const InlineProp: React.FC<Props> = (props) => {
    return <div />;
};

export default InlineProp;
