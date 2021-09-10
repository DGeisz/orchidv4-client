/*
 * New page command
 */
export interface NewPageCommand {
    NewPage: {
        target_client: string;
    };
}

export interface FullPageCommand {
    FullPage: {
        page_id: string;
    };
}

export interface FillDecSocketCommand {
    FillDecSocket: {
        page_id: string;
        socket_id: string;
        dec_name: string;
    };
}
