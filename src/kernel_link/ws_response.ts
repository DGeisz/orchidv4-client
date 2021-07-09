import { PageSerialization } from "../routes/page/serialization/page_serialization";

export type WsResponse = NewPageResponse | FullPageResponse;

/*
 * Type and guard for a simple new page
 * response
 */
export interface NewPageResponse {
    NewPage: {
        page_id: string;
    };
}

export function isNewPageResponse(res: WsResponse): res is NewPageResponse {
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

export function isFullPageResponse(res: WsResponse): res is FullPageResponse {
    return res.hasOwnProperty("FullPage");
}
