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

export interface AppendDecSocketCommand {
    AppendDecSocket: {
        page_id: string;
    };
}

export interface DeleteDecSocketCmd {
    DeleteDecSocket: {
        page_id: String;
        socket_id: String;
    };
}
