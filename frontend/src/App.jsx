import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "./routes/Home";
import GamePage from "./routes/GamePage";
import ErrorPage from "./routes/ErrorPage";

import "./App.css";

function App() {
    const navigate = useNavigate();

    const startGame = () => {
        navigate("/start");
    };

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
