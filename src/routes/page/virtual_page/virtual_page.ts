import { VirtualFeatureSocket } from "./virtual_feature_socket/virtual_feature_socket";
import {
    isFullPageResponse,
    WsResponse,
} from "../../../kernel_link/ws_response";
import { PageSerialization } from "../serialization/page_serialization";

export class VirtualPage {
    private page_id?: string;
    private virtual_feature_socket?: VirtualFeatureSocket;

    handle_ws_response: (res: WsResponse) => PageSerialization | null = (
        res: WsResponse
    ) => {
        /*
         * Handle full page responses
         */
        if (isFullPageResponse(res)) {
            const { page } = res.FullPage;

            if (this.page_id === page.page_id) {
                this.virtual_feature_socket = new VirtualFeatureSocket(
                    page.feature_tree
                );
            }
        }

        if (!!this.virtual_feature_socket && !!this.page_id) {
            return {
                page_id: this.page_id,
                feature_tree: this.virtual_feature_socket.serialize(),
            };
        } else {
            return null;
        }
    };

    set_page_id = (page_id: string) => {
        this.page_id = page_id;
    };
}

export const virtual_page = new VirtualPage();
