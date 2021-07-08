import React, { useEffect } from "react";
import "./file_explorer_styles.scss";
import { kernel_link } from "../../kernel_link/kernel_link";
import {
    isNewPageResponse,
    NewPageResponse,
} from "../../kernel_link/ws_response";

/*
 * Initialize the kernel link
 */
const FileExplorer: React.FC = () => {
    useEffect(() => {
        kernel_link.set_handler((res) => {
            /*
             * If the response is a new page response
             * we want to open a new tab with that id
             */
            if (isNewPageResponse(res)) {
                res = res as NewPageResponse;

                window.open(`page/${res.NewPage.page_id}`);
            }
        });
    }, []);

    return (
        <div className="file-explorer-page">
            <div className="new-page-button" onClick={kernel_link.new_page}>
                New Page
            </div>
        </div>
    );
};

export default FileExplorer;
