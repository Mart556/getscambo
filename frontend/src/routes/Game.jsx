import { useGame } from "../context/GameContext.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useState, useEffect } from "react";

const Game = () => {
	const { currentImage, answerQuestion } = useGame();
	const [isSliding, setIsSliding] = useState(false);
	const [displayImage, setDisplayImage] = useState(currentImage);

	useEffect(() => {
		if (currentImage !== displayImage) {
			setIsSliding(true);

			const timeout = setTimeout(() => {
				setDisplayImage(currentImage);
				setIsSliding(false);
			}, 300);

			return () => clearTimeout(timeout);
		}
	}, [currentImage, displayImage]);

	return (
		<div className='game-screen flex flex-col items-center justify-between h-full bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4'>
			<div className='flex grow justify-center items-center w-full overflow-hidden'>
				<Zoom>
					<img
						className={`rounded-lg max-w-[300px] max-h-[400px] object-contain transition-transform duration-300 ease-in-out ${
							isSliding
								? "translate-x-full opacity-0"
								: "translate-x-0 opacity-100"
						}`}
						src={`./${displayImage}`}
						alt='Question'
					/>
				</Zoom>
			</div>

			<div className='flex flex-row justify-center items-center w-full'>
				<button
					onClick={() => answerQuestion(true)}
					className='bg-green-500 hover:bg-green-600 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer transition-colors'
				>
					<FontAwesomeIcon icon={faThumbsUp} /> Legit
				</button>

				<button
					onClick={() => answerQuestion(false)}
					className='bg-red-500 hover:bg-red-600 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer transition-colors'
				>
					<FontAwesomeIcon icon={faThumbsDown} /> Scam
				</button>
			</div>
		</div>
	);
};



export default Game;
