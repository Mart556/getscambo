import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext.jsx";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { TbFishHook } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";

const Game = () => {
	const { currentImage, answerQuestion, setIsImageLoading } = useGame();
	const [isSliding, setIsSliding] = useState(false);
	const [displayImage, setDisplayImage] = useState(currentImage);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	useEffect(() => {
		if (currentImage !== displayImage) {
			setIsSliding(true);
			setIsImageLoaded(false);
			setIsImageLoading(true);

			const timeout = setTimeout(() => {
				setDisplayImage(currentImage);
				setIsSliding(false);
			}, 300);

			return () => clearTimeout(timeout);
		}
	}, [currentImage, displayImage, setIsImageLoading]);

	const handleImageLoad = () => {
		setIsImageLoaded(true);
		setIsImageLoading(false);
	};

	return (
		<div className='game-screen flex flex-col items-center justify-between h-full  dark:bg-gray-800 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4'>
			<div className='flex grow justify-center items-center w-full overflow-hidden'>
				{!isImageLoaded && (
					<div className='absolute flex flex-col items-center gap-3'>
						<div className='w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin'></div>
						<p className='text-gray-600 dark:text-gray-400 text-sm'>
							Laadin pilti...
						</p>
					</div>
				)}
				<Zoom>
					<img
						className={`rounded-lg max-w-[300px] max-h-[400px] object-contain transition-transform duration-300 ease-in-out ${
							isSliding
								? "translate-x-full opacity-0"
								: "translate-x-0 opacity-100"
						}`}
						src={`./${displayImage}`}
						alt='Question'
						onLoad={handleImageLoad}
						onError={handleImageLoad}
					/>
				</Zoom>
			</div>

			<div className='flex flex-row justify-center items-center w-full space-x-4 text-white font-bold'>
				<button
					onClick={() => answerQuestion(true)}
					disabled={!isImageLoaded}
					className='bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-2 md:py-5  w-1/2  md:w-1/2 rounded md:m-3  transition-colors'
				>
					<span className='flex items-center justify-center text-md xs:text-xl md:text-3xl'>
						<GrValidate className='me-2' /> Usaldusväärne
					</span>
				</button>

				<button
					onClick={() => answerQuestion(false)}
					disabled={!isImageLoaded}
					className='bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-2 md:py-5 w-1/2  md:w-1/2 rounded md:m-3 transition-colors'
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
