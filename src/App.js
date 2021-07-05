import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

const socket = new WebSocket("ws://localhost:7200");

socket.addEventListener("open", () => {
    socket.send("Hello kittens!");
});

function App() {
    const [count, setCount] = useState("0");

    useEffect(() => {
        socket.addEventListener("message", (e) => {
            console.log("Received message:", e.data);
            setCount(e.data);
        });
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Number of pages open: {count}</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
