/**
 * The virtual page intakes commands from the kernel link
 * and uses these commands to assemble a "editor representation"
 * of the page.  Namely, an unfinished command can be stored
 * in the virtual page prior to being committed to the kernel
 * for type checking.  The virtual page then sends a processed
 * view skeleton of the page to the react component tree for
 * final processing
 */
import { WsResponse } from "../../../kernel_link/ws_response";
import { ViewSkeleton } from "../view_skeleton/view_skeleton";

class VirtualPage {
    process_response = (res: WsResponse) => {};
    get_view_skeleton = () => {
        const a: ViewSkeleton = {};

        return a;
    };
}

export const virtual_page = new VirtualPage();
