import React from "react";
import TexLine from "./tex_line/tex_line";
import GlobalHeader from "./global_header/global_header";
import SurroundIndent from "./surround_indent/surround_index";
import InlineProp from "./inline_prop/inline_prop";
import LambdaProp from "./lambda_prop/lambda_prop";
import {
    ReducedFormTag,
    ReducedFormType,
} from "../../page_types/reduced_form/reduced_form";

interface Props {
    form: ReducedFormType;
}

const ReducedForm: React.FC<Props> = (props) => {
    const { form } = props;

    switch (form.tag) {
        case ReducedFormTag.TexLine:
            return <TexLine tex_line={form} />;
        case ReducedFormTag.GlobalHeader:
            return <GlobalHeader global_header={form} />;
        case ReducedFormTag.SurroundIndent:
            return <SurroundIndent surround_indent={form} />;
        case ReducedFormTag.InlineProp:
            return <InlineProp inline_prop={form} />;
        case ReducedFormTag.LambdaProp:
            return <LambdaProp lambda_prop={form} />;
    }
};

export default ReducedForm;
