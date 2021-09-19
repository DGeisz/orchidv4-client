import React from "react";

interface PageContextType {
    select_socket: (socket_id: string) => void;
    select_mode: boolean;
    select_seq: string;
    edit_rep_mode: boolean;
    edit_rep_id: string;
    page_id: string;
}

export const PageContext = React.createContext<PageContextType>({
    select_socket: () => {},
    select_mode: false,
    select_seq: "",
    edit_rep_mode: false,
    edit_rep_id: "",
    page_id: "",
});
