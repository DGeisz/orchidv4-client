import React, { useEffect, useState } from "react";
import "./page_styles.scss";
import { useParams } from "react-router-dom";
import { kernel_link } from "../../kernel_link/kernel_link";
import { PropagateLoader } from "react-spinners";
import { palette } from "../../global_styles/palette";
import { VirtualPage } from "./virtual_page/virtual_page";
import ReducedForm from "./building_blocks/reduced_form/reduced_form";
import DarkModeSwitch from "../../global_building_blocks/dark_mode_switch/dark_mode_switch";
import { ReducedFormType } from "./page_types/reduced_form/reduced_form";
import { PageContext } from "./page_context";
import { CURSOR_NAME } from "./utils/latex_utils";

const Page: React.FC = () => {
    const { page_id } = useParams<{ page_id: string | undefined }>();
    const pid = !!page_id ? page_id.toString() : "";

    const [select_socket, set_select_socket] =
        useState<(socket_id: string) => void>();
    const [select_mode, set_select_mode] = useState<boolean>(false);
    const [select_seq, set_select_seq] = useState<string>("");

    const [reduced_forms, set_reduced_forms] = useState<ReducedFormType[]>();

    useEffect(() => {
        if (!!pid) {
            const virtual_page = new VirtualPage(
                pid,
                set_reduced_forms,
                set_select_mode,
                set_select_seq
            );

            set_select_socket(() => virtual_page.select_socket);

            /*
             * Set the response handler first and foremost
             */
            kernel_link.set_handler(virtual_page.process_response);

            /*
             * Then let_assignment the kernel know we want
             * a full page serialization
             */
            kernel_link.full_page(pid);

            return () => {
                kernel_link.set_handler(() => {});
            };
        }
    }, [pid]);

    /* Scroll the cursor into view
     */
    useEffect(() => {
        const cursor = document.getElementById(CURSOR_NAME);

        if (!!cursor && !select_mode) {
            cursor.scrollIntoView({
                behavior: "auto",
                block: "nearest",
            });
        }
    }, [reduced_forms]);

    if (!!reduced_forms && !!select_socket) {
        return (
            <PageContext.Provider
                value={{ select_socket, select_mode, select_seq }}
            >
                <div id="yota" />
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-header-right">
                            <DarkModeSwitch />
                        </div>
                    </div>
                    {reduced_forms.map((form, index) => (
                        <ReducedForm form={form} key={`${pid}:${index}`} />
                    ))}
                    <div className="pg-footer">
                        <div
                            className="pg-add-button"
                            onClick={() => kernel_link.append_dec_socket(pid)}
                        >
                            +
                        </div>
                    </div>
                </div>
            </PageContext.Provider>
        );
    } else {
        return (
            <div className="loading-page-container">
                <div className="page-header">
                    <div className="page-header-right">
                        <DarkModeSwitch />
                    </div>
                </div>
                <PropagateLoader color={palette.comp_fg_green} size={15} />
            </div>
        );
    }
};

export default Page;
