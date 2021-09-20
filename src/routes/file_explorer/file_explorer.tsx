import React, { useEffect } from "react";
import "./file_explorer_styles.scss";
import { kernel_link } from "../../kernel_link/kernel_link";
import { is_new_page, NewPageResponse } from "../../kernel_link/ws_response";
import DarkModeSwitch from "../../global_building_blocks/dark_mode_switch/dark_mode_switch";

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
            if (is_new_page(res)) {
                res = res as NewPageResponse;

                /*
                 * Now make sure we're the actual client that requested this one.
                 * Otherwise, all the file explorer clients would open the new page
                 */
                if (res.NewPage.target_client === kernel_link.get_link_id()) {
                    /*
                     * */
                    window.open(`page/${res.NewPage.new_page.id}`);
                }
            }
        });

        return () => kernel_link.set_handler(() => {});
    }, []);

    return (
        <div className="file-explorer-page">
            <div className="fe-header">
                <div className="fe-header-left">
                    <div
                        className="new-page-button"
                        onClick={kernel_link.new_page}
                    >
                        New Page
                    </div>
                </div>
                <div className="fe-header-right">
                    <DarkModeSwitch />
                </div>
            </div>
        </div>
    );
};

export default FileExplorer;
