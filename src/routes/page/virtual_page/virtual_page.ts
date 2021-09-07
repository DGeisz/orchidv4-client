import { is_full_page, WsResponse } from "../../../kernel_link/ws_response";
import { VDecSocket } from "./v_lexicon/v_declaration/v_dec_socket";
import { PageSkeleton } from "../page_skeleton/page_skeleton";

/**
 * The virtual page intakes commands from the kernel link
 * and uses these commands to assemble a "editor representation"
 * of the page.  Namely, an unfinished command can be stored
 * in the virtual page prior to being committed to the kernel
 * for type checking.  The virtual page then sends a processed
 * view skeleton of the page to the react component tree for
 * final processing.
 *
 * In all sub files of this directly, a prefix of "V" or "v_"
 * means "virtual"
 */
class VirtualPage {
    private id: string = "";
    private dec_sockets: VDecSocket[] = [];

    set_id = (id: string) => {
        this.id = id;
    };

    process_response = (res: WsResponse) => {
        if (is_full_page(res)) {
            const page = res.FullPage.page;

            /* First make sure that this is even the right page */
            if (page.id === this.id) {
                /* Now, initialize the dec sockets */
                this.dec_sockets = page.dec_sockets.map(
                    (dec) => new VDecSocket(dec)
                );
            }
        }
    };

    get_page_skeleton: () => PageSkeleton = () => {
        return {
            dec_sockets: this.dec_sockets.map((socket) =>
                socket.get_skeleton()
            ),
        };
    };
}

export const virtual_page = new VirtualPage();
