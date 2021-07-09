import React from "react";
import { Switch, Route } from "react-router-dom";
import FileExplorer from "./routes/file_explorer/file_explorer";
import Page from "./routes/page/page";

function App() {
    return (
        <Switch>
            <Route path="/page/:page_id">
                <Page />
            </Route>
            <Route path="/">
                <FileExplorer />
            </Route>
        </Switch>
    );
}

export default App;
