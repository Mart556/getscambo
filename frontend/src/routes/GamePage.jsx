import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext.jsx";

import Game from "./Game";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

const GamePage = () => {
	const { currentPoints, highestPoints, isGameActive, gameTime, finishGame } =
		useGame();
	const [timeLeft, setTime] = useState(gameTime);
	const intervalRef = useRef(null);

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
		<div className='container mx-auto px-4 md:px-8 h-screen flex flex-col max-h-screen'>
			<div className='bg-neutral-800/75 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg mt-4 flex flex-row justify-between'>
				<div className='flex justify-start items-center'>
					<p className='text-xl md:text-2xl font-bold text-white me-3'>
						Punkte:{" "}
						<span className={`${bounce ? "bounce" : ""} inline-block`}>
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
