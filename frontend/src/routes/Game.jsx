import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext.jsx";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { TbFishHook } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";

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

			<div className='flex flex-row justify-center items-center w-full space-x-4 text-white font-bold'>
				<button
					onClick={() => answerQuestion(true)}
					className='bg-green-500 hover:bg-green-600  py-4 px-2 md:py-5  w-1/2  md:w-1/2 rounded md:m-3  transition-colors'
				>
					<span className='flex items-center justify-center text-md xs:text-xl md:text-3xl'>
						<GrValidate className='me-2' /> Usaldusväärne
					</span>
				</button>

				<button
					onClick={() => answerQuestion(false)}
					className='bg-red-500 hover:bg-red-600 py-4 px-2 md:py-5 w-1/2  md:w-1/2 rounded md:m-3 transition-colors'
				>
					<span className='flex items-center justify-center text-md xs:text-xl md:text-3xl '>
						<TbFishHook className='me-2' /> Õngitsus
					</span>
				</button>
			</div>
		</div>
	);
};

export default Game;
