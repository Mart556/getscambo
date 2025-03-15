import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "./routes/Home";
import GamePage from "./routes/GamePage";
import ErrorPage from "./routes/ErrorPage";

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
            <Route path="/start" element={<GamePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/404" element={<ErrorPage />} />
        </Routes>
    );
}

export default App;
