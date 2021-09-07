import { PageSerialization } from "../global_serde/page_serialization";

export type WsResponse = NewPageResponse | FullPageResponse;

/*
 * Type and guard for a simple new page
 * response
 */
export interface NewPageResponse {
    NewPage: {
        target_client: string;
        new_page: PageSerialization;
    };
}

export function is_new_page(res: WsResponse): res is NewPageResponse {
    return res.hasOwnProperty("NewPage");
}

/*
 * Type and guard for a full page
 * response
 */
export interface FullPageResponse {
    FullPage: {
        page: PageSerialization;
    };
}

export function is_full_page(res: WsResponse): res is FullPageResponse {
    return res.hasOwnProperty("FullPage");
}
