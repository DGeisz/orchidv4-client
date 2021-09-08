import React, { useEffect, useState } from "react";
import "./page_styles.scss";
import { useParams } from "react-router-dom";
import { kernel_link } from "../../kernel_link/kernel_link";
import { PropagateLoader } from "react-spinners";
import { palette } from "../../global_styles/palette";
import { virtual_page } from "./virtual_page/virtual_page";
import {
    example_reduced_forms,
    ReducedFormType,
} from "./reduced_form/reduced_form";
import ReducedForm from "./building_blocks/reduced_form/reduced_form";

const Page: React.FC = () => {
    const { page_id } = useParams<{ page_id: string | undefined }>();
    const pid = !!page_id ? page_id.toString() : "";

    const [reduced_forms, set_reduced_forms] = useState<ReducedFormType[]>(
        example_reduced_forms
    );

    useEffect(() => {
        /*
         * Set the response handler first and foremost
         */
        kernel_link.set_handler(virtual_page.process_response);

        /*
         * Then let the kernel know we want
         * a full page serialization
         */
        kernel_link.full_page(pid);

        return () => {
            kernel_link.set_handler(() => {});
        };
    }, [pid]);

    if (!!reduced_forms) {
        return (
            <div className="page-container">
                {reduced_forms.map((form) => (
                    <ReducedForm form={form} />
                ))}
            </div>
        );
    } else {
        return (
            <div className="loading-page-container">
                <PropagateLoader color={palette.comp_fg_green} size={15} />
            </div>
        );
    }
};

export default Page;
