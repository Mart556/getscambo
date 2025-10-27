import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useGame } from "../context/GameContext.jsx";

import { FaHome } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";

const EndReasons = {
	["time"]: "Aeg sai otsa!",
	["answer"]: "Vastasid valesti!",
};

const EndGame = () => {
	const [searchParams] = useSearchParams();
	const endReasonText = EndReasons[searchParams.get("reason")] || "Mäng läbi!";
	const { startGame, preloadedMeme } = useGame();
	const navigate = useNavigate();

	const [meme, setMeme] = useState(preloadedMeme || { url: null, name: "" });

	useEffect(() => {
		if (preloadedMeme) {
			setMeme(preloadedMeme);
		}
	}, [preloadedMeme]);

	return (
		<div className='flex flex-col items-center justify-around min-h-screen'>
			<div className='flex flex-col justify-center items-center w-full'>
				<h1 className='text-4xl sm:text-5xl md:text-6xl font-bold dark:text-white text-center'>
					{endReasonText}
				</h1>
			</div>

			<div className='flex flex-col justify-center items-center w-full'>
				{meme.url ? (
					<img
						src={meme.url}
						alt={meme.name}
						className='rounded-lg shadow-lg w-full h-auto max-w-xs max-h-[360px] my-4 animate-fadeIn'
					/>
				) : (
					<div className='rounded-lg shadow-lg w-full h-[360px] max-w-xs my-4 flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
						<div className='flex flex-col items-center gap-3'>
							<div className='w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin'></div>
							<p className='text-gray-600 dark:text-gray-400'>Laeb meemi...</p>
						</div>
					</div>
				)}
			</div>

			<div className='flex flex-col sm:flex-row justify-center items-center w-full sm:w-1/2'>
				<button
					type='button'
					className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer transition-colors'
					onClick={() =>
						startGame(localStorage.getItem("difficulty") || "medium")
					}
				>
					<span className='flex items-center justify-center text-2xl md:text-3xl'>
						<FaRepeat className='me-2' /> Uuesti
					</span>
				</button>

				<button
					type='button'
					className='bg-red-500 hover:bg-red-600 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer transition-colors'
					onClick={() => navigate("/")}
				>
					<span className='flex items-center justify-center text-2xl md:text-3xl'>
						<FaHome className='me-2' /> Tagasi
					</span>
				</button>
			</div>
		</div>
	);
};

export default EndGame;
