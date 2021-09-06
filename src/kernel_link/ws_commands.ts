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
