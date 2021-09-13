import React from "react";

interface PageContextType {
    select_socket: (socket_id: string) => void;
}

export const PageContext = React.createContext<PageContextType>({
    select_socket: () => {},
});
