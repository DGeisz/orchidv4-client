import React, { useEffect, useState } from "react";
import "./page_styles.scss";
import { useParams } from "react-router-dom";
import { kernel_link } from "../../kernel_link/kernel_link";
import { PropagateLoader } from "react-spinners";
import { palette } from "../../global_styles/palette";
import { virtual_page } from "./virtual_page/virtual_page";
import { ViewSkeleton } from "./view_skeleton/view_skeleton";

const Page: React.FC = () => {
    const { page_id } = useParams<{ page_id: string | undefined }>();

    const pid = !!page_id ? page_id.toString() : "";

    const [view_skeleton, set_view_skeleton] = useState<null | ViewSkeleton>(
        null
    );

    useEffect(() => {
        kernel_link.set_handler((res) => {
            virtual_page.process_response(res);

            set_view_skeleton(virtual_page.get_view_skeleton());
        });

        kernel_link.full_page(pid);

        return () => kernel_link.set_handler(() => {});
    }, [pid]);

    if (!!view_skeleton) {
        return <div />;
    } else {
        return (
            <div className="loading-page-container">
                <PropagateLoader color={palette.comp_fg_green} size={15} />
            </div>
        );
    }
};

export default Page;
