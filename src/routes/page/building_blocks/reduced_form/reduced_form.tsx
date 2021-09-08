import React from "react";
import {
    is_global_header,
    is_inline_prop,
    is_lambda_prop,
    is_surround_indent,
    is_tex_line,
    ReducedFormType,
} from "../../reduced_form/reduced_form";
import TexLine from "./tex_line/tex_line";
import GlobalHeader from "./global_header/global_header";
import SurroundIndent from "./surround_indent/surround_index";
import InlineProp from "./inline_prop/inline_prop";
import LambdaProp from "./lambda_prop/lambda_prop";

interface Props {
    form: ReducedFormType;
}

const ReducedForm: React.FC<Props> = (props) => {
    const { form } = props;

    if (is_tex_line(form)) {
        return <TexLine tex_line={form} />;
    } else if (is_global_header(form)) {
        return <GlobalHeader global_header={form} />;
    } else if (is_surround_indent(form)) {
        return <SurroundIndent surround_indent={form} />;
    } else if (is_inline_prop(form)) {
        return <InlineProp inline_prop={form} />;
    } else if (is_lambda_prop(form)) {
        return <LambdaProp lambda_prop={form} />;
    } else return null;
};

export default ReducedForm;
