import React, { useState } from "react";
import { DecSocketSk } from "../../../page_skeleton/lexicon_sk/declaration_sk/dec_socket_sk";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";

interface Props {
    skeleton: DecSocketSk;
}

const DecSocket: React.FC<Props> = (props) => {
    const [cmd, set_cmd] = useState<string>("asdfa");

    /*
     * First, if the socket is actually filled in
     * then we automatically render the appropriate
     * component
     */
    switch (props.skeleton.declaration.tag) {
        case "const":
            return <div />;
        case "def":
            return <div />;
    }

    /*
     * Otherwise, we render a text block
     */
    return (
        <div>
            <MathJaxElement
                termIds={[]}
                tex={`\\text{${cmd}}`}
                showTermHints={false}
                selectTerm={() => {}}
            />
        </div>
    );
};

export default DecSocket;
