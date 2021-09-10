import { WsResponse } from "./ws_response";
import {
    FillDecSocketCommand,
    FullPageCommand,
    NewPageCommand,
} from "./ws_commands";
import { v4 } from "uuid";

class KernelLink {
    private link_id: string;
    private readonly addr: string;
    private ws: WebSocket;
    private ws_open: boolean = false;
    private response_handler?: (res: WsResponse) => void;
    private send_queue: string[] = [];

    constructor(addr?: string) {
        this.link_id = v4();

        if (!!addr) {
            this.addr = addr;
        } else {
            this.addr = "ws://127.0.0.1:7200";
        }

        this.ws = new WebSocket(this.addr);
        console.log("Just initilized!");
        this.configure_ws();
    }

    reconnect_ws = () => {
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;

        console.log("reconnecting");
        this.ws = new WebSocket(this.addr);
        this.configure_ws();
    };

    configure_ws = () => {
        this.ws.onerror = () => {
            this.ws.close();
        };

        this.ws.onclose = () => {
            this.ws_open = false;

            // Attempt to reconnect every 3 seconds
            setTimeout(this.reconnect_ws, 3000);
        };

        this.ws.onopen = () => {
            this.ws_open = true;

            console.log("This is send queue", this.send_queue);

            for (let msg of this.send_queue) {
                this.ws.send(msg);
            }

            this.send_queue = [];
        };

        /*
         * If the handler is defined, then
         * add a new message event handler
         */
        if (!!this.response_handler) {
            this.ws.onmessage = (e) => {
                /*
                 * First parse the message into a ws response
                 */
                let res: WsResponse = JSON.parse(e.data);

                /*
                 * Then pass the response to the handler
                 */
                !!this.response_handler && this.response_handler(res);
            };
        }
    };

    set_handler = (handler: (res: WsResponse) => void) => {
        this.response_handler = handler;

        this.configure_ws();
    };

    send_message = (msg: string) => {
        if (this.ws_open) {
            this.ws.send(msg);
        } else {
            this.send_queue.push(msg);
        }
    };

    /*
     * The following methods are direct
     * requests to be sent to the server
     */
    new_page = () => {
        const cmd: NewPageCommand = {
            NewPage: {
                target_client: this.link_id,
            },
        };

        this.send_message(JSON.stringify(cmd));
    };

    full_page = (page_id: string) => {
        const cmd: FullPageCommand = {
            FullPage: {
                page_id,
            },
        };

        this.send_message(JSON.stringify(cmd));
    };

    get_link_id = () => {
        return this.link_id;
    };

    fill_dec_socket = (
        page_id: string,
        socket_id: string,
        dec_name: string
    ) => {
        const cmd: FillDecSocketCommand = {
            FillDecSocket: {
                page_id,
                socket_id,
                dec_name,
            },
        };

        this.send_message(JSON.stringify(cmd));
    };
}

export const kernel_link = new KernelLink();
