/*
 * New page command
 */
export interface NewPageCmd {
    NewPage: {
        target_client: string;
    };
}

export interface FullPageCmd {
    FullPage: {
        page_id: string;
    };
}

export interface DecSocketCmd {
    DecSocket: {
        page_id: string;
        cmd: DecSocketCmdEnum;
    };
}

/*
 * Dec Socket Commands */
export interface FillCmd {
    Fill: {
        socket_id: string;
        dec_name: string;
    };
}

export type AppendCmd = "Append";

export interface DeleteCmd {
    Delete: {
        socket_id: string;
    };
}

export interface DeleteContentsCmd {
    DeleteContents: {
        socket_id: string;
    };
}

export interface InsertCmd {
    Insert: {
        rel_socket_id: string;
        before_rel: boolean;
    };
}

type DecSocketCmdEnum =
    | FillCmd
    | AppendCmd
    | DeleteCmd
    | DeleteContentsCmd
    | InsertCmd;

/*
 * Term def socket commands
 */
export interface TermDefSocketCmd {
    TermDefSocket: {
        page_id: string;
        cmd: TermDefCmds;
    };
}

export interface TDFillCmd {
    Fill: {
        tds_id: string;
        term_seq: string;
    };
}

export interface TDDeleteContentsCmd {
    DeleteContents: {
        tds_id: string;
    };
}

export interface TdSetRepCmd {
    SetRep: {
        tds_id: string;
        rep: string;
    };
}

type TermDefCmds = TDFillCmd | TDDeleteContentsCmd | TdSetRepCmd;
