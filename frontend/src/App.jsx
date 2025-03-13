import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "./routes/Home";
import Game from "./routes/Game";

import "./App.css";

function App() {
    const navigate = useNavigate();
    //const topPlayers = [];

    const startGame = () => {
        navigate("/start");
    };

    useEffect(() => {
        // TODO Fetch top 10 users from the server
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home onStartGame={startGame} />} />
            <Route path="/start" element={<Game />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
