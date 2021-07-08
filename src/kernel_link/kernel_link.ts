import { WsResponse } from "./ws_response";
import { NewPage } from "./ws_commands";

class KernelLink {
    private readonly addr: string;
    private ws: WebSocket;
    private response_handler?: (res: WsResponse) => void;

    constructor(addr?: string) {
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
            // Attempt to reconnect every 3 seconds
            setTimeout(this.reconnect_ws, 3000);
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

    /*
     * The following methods are direct
     * requests to be sent to the server
     */
    new_page = () => {
        this.ws.send(JSON.stringify(NewPage));
    };
}

export const kernel_link = new KernelLink();
