import React, { useEffect, useState } from "react";
import "./page_styles.scss";
import { useParams } from "react-router-dom";
import { kernel_link } from "../../kernel_link/kernel_link";
import { virtual_page } from "./virtual_page/virtual_page";
import { PageSerialization } from "./serialization/page_serialization";
import { PropagateLoader } from "react-spinners";
import { palette } from "../../global_styles/palette";
import FeatureSocket from "./building_blocks/feature_socket/feature_socket";

const Page: React.FC = () => {
    const { page_id } = useParams<{ page_id: string | undefined }>();

    const [page_serialization, set_page_serialization] =
        useState<PageSerialization | null>(null);

    useEffect(() => {
        if (!!page_id) {
            virtual_page.set_page_id(page_id);

            /*
             * This handler sends the ws response
             * to the virtual page, and then uses
             * the page serialization from the virtual page
             * to update this react page's state
             */
            kernel_link.set_handler((res) => {
                const page_ser = virtual_page.handle_ws_response(res);

                set_page_serialization(page_ser);
            });

            /*
             * Finally, send a response out requesting
             * the full page
             */
            kernel_link.full_page(page_id);
        }
    }, [page_id]);

    if (!!page_serialization) {
        return (
            <div className="page-container">
                <FeatureSocket
                    serialization={page_serialization.feature_tree}
                />
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
