import React, { useEffect, useState } from "react";
import MathJaxElement from "../../../../../global_building_blocks/mathjax_element/mathjax_element";
import {
    DecSocketSer,
    is_const,
    is_def,
} from "../../../../../global_serde/lexicon/declaration/dec_serialization";
import { is_some } from "../../../../../global_serde/utils/rust_option";

interface Props {
    socket: DecSocketSer;
}

const DecSocket: React.FC<Props> = (props) => {
    const [cmd, set_cmd] = useState<string>("asdf");

    useEffect(() => {
        document.addEventListener("keypress", (e) => {
            set_cmd((cmd) => cmd + e.key);
        });
    }, []);

    /*
     * First, if the socket is actually filled in
     * then we automatically render the appropriate
     * component
     */
    if (is_some(props.socket.dec_ser)) {
        const { Some: dec_some } = props.socket.dec_ser;

        if (is_const(dec_some)) {
            return <div />;
        } else if (is_def(dec_some)) {
            return <div />;
        }
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
