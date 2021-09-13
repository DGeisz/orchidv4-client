import { PageSerialization } from "../routes/page/page_types/page_serde/page_serialization";
import { DecSocketSer } from "../routes/page/page_types/page_serde/lexicon/declaration/dec_serialization";

export type WsResponse = NewPageResponse | FullPageResponse | DecSocketRes;

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

/*
 * Type and guard for dec socket res
 */
export interface DecSocketRes {
    DecSocket: {
        page_id: string;
        res: DecSocketResEnum;
    };
}

export function is_dec_socket_res(res: WsResponse): res is DecSocketRes {
    return res.hasOwnProperty("DecSocket");
}

type DecSocketResEnum = DecUpdate | DecAppend | DecInsert | DecDelete;

export interface DecUpdate {
    Update: {
        dec_socket_ser: DecSocketSer;
    };
}

export function is_dec_update(res: DecSocketResEnum): res is DecUpdate {
    return res.hasOwnProperty("Update");
}

export interface DecAppend {
    Append: {
        dec_socket_ser: DecSocketSer;
    };
}

export function is_dec_append(res: DecSocketResEnum): res is DecAppend {
    return res.hasOwnProperty("Append");
}

export interface DecInsert {
    Insert: {
        rel_socket_id: string;
        before_rel: boolean;
        dec_socket_ser: DecSocketSer;
    };
}

export function is_dec_insert(res: DecSocketResEnum): res is DecInsert {
    return res.hasOwnProperty("Insert");
}

export interface DecDelete {
    Delete: {
        dec_socket_id: string;
    };
}

export function is_dec_delete(res: DecSocketResEnum): res is DecDelete {
    return res.hasOwnProperty("Delete");
}
