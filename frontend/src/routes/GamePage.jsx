import { useEffect, useRef, useReducer, useCallback, useState } from "react";
import Game from "./Game";
import EndGame from "./EndGame";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

const Time = 60000;

const initialState = {
	currentPoints: 0,
	highestPoints: localStorage.getItem("highestPoints") || 0,
	isGameRunning: true,
	gameEndReason: "",
	bounce: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "ADD_POINTS":
			return {
				...state,
				currentPoints: state.currentPoints + 1,
				bounce: true,
			};
		case "SET_HIGHEST_POINTS":
			localStorage.setItem("highestPoints", action.payload);
			return { ...state, highestPoints: action.payload };
		case "RESET_POINTS":
			return { ...state, currentPoints: 0 };
		case "SET_GAME_RUNNING":
			return {
				...state,
				isGameRunning: action.payload.isRunning,
				gameEndReason: action.payload.reason,
			};
		case "STOP_BOUNCE":
			return { ...state, bounce: false };
		default:
			return state;
	}
};

const GamePage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		currentPoints,
		highestPoints,
		isGameRunning,
		gameEndReason,
		bounce,
	} = state;

	const intervalRef = useRef(null);

	const handleGameRunningChange = useCallback((isRunning, reason = "") => {
		dispatch({ type: "SET_GAME_RUNNING", payload: { isRunning, reason } });
		clearInterval(intervalRef.current);
	}, []);

	const handlePointsChange = () => {
		dispatch({ type: "ADD_POINTS" });
	};

	useEffect(() => {
		if (currentPoints > highestPoints) {
			dispatch({ type: "SET_HIGHEST_POINTS", payload: currentPoints });
		}
	}, [currentPoints, highestPoints]);

	const [timeLeft, setTime] = useState(Time);

	useEffect(() => {
		const updateTime = () => {
			setTime((prevTime) => {
				if (prevTime <= 0) {
					handleGameRunningChange(false, "time");
					return 0;
				}

				return prevTime - 1000;
			});
		};

		intervalRef.current = setInterval(updateTime, 1000);

		return () => clearInterval(intervalRef.current);
	}, [handleGameRunningChange]);

	useEffect(() => {
		if (bounce) {
			const timer = setTimeout(
				() => dispatch({ type: "STOP_BOUNCE" }),
				500
			);
			return () => clearTimeout(timer);
		}
	}, [bounce]);

	return (
		<div className='container mx-auto px-4 md:px-8 h-screen flex flex-col max-h-screen'>
			<div className='bg-neutral-800/75 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg mt-4 flex flex-row justify-between'>
				<div className='flex justify-start items-center'>
					<p className='text-xl md:text-2xl font-bold text-white me-3'>
						Punkte:{" "}
						<span
							className={`${bounce ? "bounce" : ""} inline-block`}
						>
							{currentPoints}
						</span>
					</p>

					<p className='text-xl md:text-2xl font-bold text-white'>
						Rekord: {highestPoints}
					</p>
				</div>

				<div className='flex justify-self-end items-center w-2/5 md:w-1/4'>
					<FontAwesomeIcon
						icon={faStopwatch}
						size='xl'
						className='text-white me-3'
					/>{" "}
					<div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
						<div
							className={`h-full ${
								timeLeft < 10000
									? "bg-red-500 blink"
									: timeLeft < Time / 2
									? "bg-yellow-500"
									: "bg-green-500"
							}`}
							style={{
								width: `${(timeLeft / Time) * 100}%`,
								transition: "width 1s linear",
							}}
						></div>
					</div>
				</div>
			</div>

			{isGameRunning ? (
				<Game
					onGameRunningChange={handleGameRunningChange}
					incrementCurrentPoints={handlePointsChange}
				/>
			) : (
				<EndGame
					isNewHighScore={
						currentPoints > localStorage.getItem("lastHighScore")
					}
					endReason={gameEndReason}
				/>
			)}
		</div>
	);
};

export default GamePage;
