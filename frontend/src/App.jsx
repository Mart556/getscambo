import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./routes/ThemeContext"; // Assuming you are using this

import Home from "./routes/Home";
import GamePage from "./routes/GamePage";
import ErrorPage from "./routes/ErrorPage";
import Info from "./routes/Info";

import "./App.css"; // Your custom styles


const App = () => {
  const { darkMode } = useTheme();  // Destructure darkMode
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<GamePage />} />
        <Route path="/info" element={<Info />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/404" element={<ErrorPage />} />
      </Routes>
  );
}


export default App;
