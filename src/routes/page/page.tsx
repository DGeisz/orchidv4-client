import React, { useEffect, useState } from "react";
import "./page_styles.scss";
import { useParams } from "react-router-dom";
import { kernel_link } from "../../kernel_link/kernel_link";
import { PropagateLoader } from "react-spinners";
import { palette } from "../../global_styles/palette";
import { virtual_page } from "./virtual_page/virtual_page";
import { PageSkeleton } from "./page_skeleton/page_skeleton";
import DecSocket from "./building_blocks/lexicon_blocks/declaration/dec_socket";

const Page: React.FC = () => {
    const { page_id } = useParams<{ page_id: string | undefined }>();

    const pid = !!page_id ? page_id.toString() : "";

    const [page_skeleton, set_page_skeleton] = useState<null | PageSkeleton>(
        null
    );

    useEffect(() => {
        virtual_page.set_id(pid);

        kernel_link.set_handler((res) => {
            virtual_page.process_response(res);

            set_page_skeleton(virtual_page.get_page_skeleton());
        });

        kernel_link.full_page(pid);

        return () => kernel_link.set_handler(() => {});
    }, [pid]);

    if (!!page_skeleton) {
        console.log("Page skeleton: ", page_skeleton);
        return (
            <div className="page-container">
                {page_skeleton.dec_sockets.map((socket) => (
                    <DecSocket skeleton={socket} key={`dec:${socket.id}`} />
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
