import { useGame } from "../context/GameContext.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Game = () => {
	const { currentImage, answerQuestion } = useGame();

	return (
		<div className='game-screen flex flex-col items-center justify-between h-full bg-neutral-800/75 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4'>
			<div className='flex grow justify-center items-center w-full'>
				<Zoom>
					<img
						className='rounded-lg max-w-[300px] max-h-[400px] object-contain'
						src={`./${currentImage}`}
						alt='Question'
					/>
				</Zoom>
			</div>

			<div className='flex flex-row justify-center items-center w-full'>
				<button
					onClick={() => answerQuestion(true)}
					className='bg-green-500 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer'
				>
					<FontAwesomeIcon icon={faThumbsUp} /> Legit
				</button>

				<button
					onClick={() => answerQuestion(false)}
					className='bg-red-500 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer'
				>
					<FontAwesomeIcon icon={faThumbsDown} /> Scam
				</button>
			</div>
		</div>
	);
};

export default Game;
