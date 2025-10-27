import { Routes, Route, Navigate } from "react-router";

import Home from "./routes/Home/Home";
import GamePage from "./routes/Game/GamePage";
import ErrorPage from "./routes/ErrorPage";
import Info from "./routes/Info";
import Auth from "./routes/Auth";
import EndGame from "./routes/EndGame";

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='*' element={<Navigate to='/' />} />

			<Route path='/start' element={<GamePage />} />
			<Route path='/info' element={<Info />} />
			<Route path='/404' element={<ErrorPage />} />
			<Route path='/start' element={<GamePage />} />
			<Route path='/auth' element={<Auth />} />
			<Route path='/end' element={<EndGame />} />
		</Routes>
	);
};

export default App;
