import { PageSerialization } from "../routes/page/page_types/page_serde/page_serialization";
import { DecSocketSer } from "../routes/page/page_types/page_serde/lexicon/declaration/dec_serialization";

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

export interface DecSocketUpdateRes {
    DecSocketUpdate: {
        page_id: String;
        dec_socket_ser: DecSocketSer;
    };
}

export function is_dec_socket_update(
    res: WsResponse
): res is DecSocketUpdateRes {
    return res.hasOwnProperty("DecSocketUpdate");
}

export interface DecSocketAppendRes {
    DecSocketAppend: {
        page_id: string;
        dec_socket_ser: DecSocketSer;
    };
}

export function is_dec_socket_append(
    res: WsResponse
): res is DecSocketAppendRes {
    return res.hasOwnProperty("DecSocketAppend");
}

export interface DecSocketDeleteRes {
    DecSocketDelete: {
        page_id: string;
        dec_socket_id: string;
    };
}

export function is_dec_socket_delete(
    res: WsResponse
): res is DecSocketDeleteRes {
    return res.hasOwnProperty("DecSocketDelete");
}

export type WsResponse =
    | NewPageResponse
    | FullPageResponse
    | DecSocketUpdateRes
    | DecSocketAppendRes
    | DecSocketDeleteRes;
