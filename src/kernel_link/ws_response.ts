export type WsResponse = NewPageResponse;

export interface NewPageResponse {
    NewPage: {
        page_id: string;
    };
}

export function isNewPageResponse(
    res: NewPageResponse
): res is NewPageResponse {
    return res.hasOwnProperty("NewPage");
}
