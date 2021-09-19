import React from "react";
import { renderToString } from "katex";

interface Props {
    tex: string;
}

const MiniTex: React.FC<Props> = (props) => {
    return (
        <div
            className="tex-container-tex"
            dangerouslySetInnerHTML={{
                __html: renderToString(props.tex, {
                    trust: true,
                    displayMode: true,
                    output: "html",
                    strict: false,
                    throwOnError: false,
                }),
            }}
        />
    );
};

export default React.memo(MiniTex);
