import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./routes/Home";
import GamePage from "./routes/GamePage";
import ErrorPage from "./routes/ErrorPage";
import Info from "./routes/Info";

import "./App.css";

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/start' element={<GamePage />} />
			<Route path='/info' element={<Info />} />
			<Route path='*' element={<Navigate to='/' />} />
			<Route path='/404' element={<ErrorPage />} />
		</Routes>
	);
};

export default App;
