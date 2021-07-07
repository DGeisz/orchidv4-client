import React from "react";
import { Switch, Route } from "react-router-dom";
import FileExplorer from "./routes/file_explorer/file_explorer";

function App() {
    return (
        <Switch>
            <Route path="/page/:page_id"></Route>
            <Route path="/">
                <FileExplorer />
            </Route>
        </Switch>
    );
}

export default App;
