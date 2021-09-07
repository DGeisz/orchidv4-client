import React, { useEffect, useState } from "react";
import "./page_styles.scss";
import { useParams } from "react-router-dom";
import { kernel_link } from "../../kernel_link/kernel_link";
import { PropagateLoader } from "react-spinners";
import { palette } from "../../global_styles/palette";
import { virtual_page } from "./virtual_page/virtual_page";
import DecSocket from "./building_blocks/lexicon_blocks/declaration/dec_socket";
import { PageSerialization } from "../../global_serde/page_serialization";
import { is_full_page } from "../../kernel_link/ws_response";
import {
    useSocketMaster,
    withSocketCmd,
} from "./building_blocks/socket_control/socket_control";

const Page: React.FC = () => {
    const { page_id } = useParams<{ page_id: string | undefined }>();
    const pid = !!page_id ? page_id.toString() : "";

    const [page_ser, set_page_ser] = useState<PageSerialization>();

    const { socket_cursor, send_event_to_socket } = useSocketMaster();

    useEffect(() => {
        /*
         * Set the response handler first and foremost
         */
        kernel_link.set_handler((res) => {
            if (is_full_page(res)) {
                set_page_ser(res.FullPage.page);
            }
        });

        /*
         * Then let the kernel know we want
         * a full page serialization
         */
        kernel_link.full_page(pid);

        return () => {
            kernel_link.set_handler(() => {});
        };
    }, [pid]);

    if (!!page_ser) {
        console.log("Here's page serialization!");
        return (
            <div className="page-container">
                {page_ser.dec_sockets.map((socket) => (
                    <DecSocket socket={socket} key={`dec:${socket.id}`} />
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
