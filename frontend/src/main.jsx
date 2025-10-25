import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GameProvider } from "./context/GameContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<GameProvider>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</GameProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
