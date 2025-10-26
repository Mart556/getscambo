import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext.jsx";

import Game from "./Game";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

const DifficultyLabels = {
	easy: "Kerge 😏",
	medium: "Keskmine 😎",
	hard: "Raske 💀",
};

const GamePage = () => {
	const {
		currentPoints,
		highestPoints,
		isGameActive,
		gameTime,
		finishGame,
		gameDifficulty,
	} = useGame();

	const [timeLeft, setTime] = useState(gameTime);
	const intervalRef = useRef(null);

	const gameDifficultyLabel =
		DifficultyLabels[gameDifficulty] || gameDifficulty;

	useEffect(() => {
		const updateTime = () => {
			setTime((prevTime) => {
				if (prevTime <= 0) {
					finishGame();
					clearInterval(intervalRef.current);
					return 0;
				}

				return prevTime - 1000;
			});
		};

		intervalRef.current = setInterval(updateTime, 1000);

		return () => clearInterval(intervalRef.current);
	}, []);

	const bounce = false;

	return (
		<div className='container mx-auto px-4 md:px-8 h-screen flex flex-col max-h-screen bg-white dark:bg-gray-900 text-black dark:text-white'>
			<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mt-4 flex flex-row justify-between border border-gray-200 dark:border-gray-700'>
				<div className='flex justify-start items-center space-x-5'>
					<p className='text-xl md:text-2xl font-bold'>
						Punkte:{" "}
						<span className={`${bounce ? "bounce" : ""} inline-block`}>
							{currentPoints}
						</span>
					</p>

					<p className='text-xl md:text-2xl font-bold'>
						Rekord: {highestPoints}
					</p>

					<p className='text-xl md:text-2xl font-bold'>
						Tase: {gameDifficultyLabel}
					</p>
				</div>

				<div className='flex justify-self-end items-center w-2/5 md:w-1/4'>
					<FontAwesomeIcon icon={faStopwatch} size='xl' className='me-3' />{" "}
					<div className='w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden'>
						<div
							className={`h-full ${
								timeLeft < 10000
									? "bg-red-500 blink"
									: timeLeft < gameTime / 2
									? "bg-yellow-500"
									: "bg-green-500"
							}`}
							style={{
								width: `${(timeLeft / gameTime) * 100}%`,
								transition: "width 1s linear",
							}}
						></div>
					</div>
				</div>
			</div>

			{isGameActive && <Game />}
		</div>
	);
};

export default GamePage;
