import { useEffect, useRef, useState, Activity } from "react";
import { useGame } from "../../context/GameContext.jsx";

import Game from "./Game.jsx";

import { FaStopwatch } from "react-icons/fa6";

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
			<div className='md:hidden flex flex-col gap-3 mt-4'>
				<div className='grid grid-cols-2 gap-3'>
					<div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase'>
							Punkte
						</p>
						<p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
							{currentPoints}
						</p>
					</div>
					<div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase'>
							Rekord
						</p>
						<p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
							{highestPoints}
						</p>
					</div>
				</div>

				<div className='flex gap-3'>
					<div className='flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase'>
							Tase
						</p>
						<p className='text-sm font-bold text-orange-600 dark:text-orange-400'>
							{gameDifficultyLabel}
						</p>
					</div>
					<div className='flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-center'>
						<div className='flex items-center gap-2 mb-2'>
							<FaStopwatch className='text-lg' />
							<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase'>
								Aeg
							</p>
						</div>
						<div className='w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden'>
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
			</div>

			<div className='hidden md:flex flex-col gap-4 mt-4'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase mb-2'>
							Punkte
						</p>
						<p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
							<span className={`${bounce ? "bounce" : ""} inline-block`}>
								{currentPoints}
							</span>
						</p>
					</div>

					<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase mb-2'>
							Rekord
						</p>
						<p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
							{highestPoints}
						</p>
					</div>

					<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase mb-2'>
							Tase
						</p>
						<p className='text-3xl font-bold text-orange-600 dark:text-orange-400'>
							{gameDifficultyLabel}
						</p>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
					<div className='flex items-center gap-3 mb-3'>
						<FaStopwatch className='text-xl text-gray-600 dark:text-gray-400' />
						<p className='text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase'>
							Aeg jäänud
						</p>
					</div>
					<div className='w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden'>
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
					<p className='text-xs text-gray-600 dark:text-gray-400 mt-2 text-right'>
						{Math.ceil(timeLeft / 1000)}s
					</p>
				</div>
			</div>

			<Activity mode={isGameActive ? "visible" : "hidden"}>
				<Game />
			</Activity>
		</div>
	);
};

export default GamePage;
