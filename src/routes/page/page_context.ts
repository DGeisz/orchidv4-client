import React from "react";

interface PageContextType {
    select_socket: (socket_id: string) => void;
    select_mode: boolean;
    select_seq: string;
}

export const PageContext = React.createContext<PageContextType>({
    select_socket: () => {},
    select_mode: false,
    select_seq: "",
});
