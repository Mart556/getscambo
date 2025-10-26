import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useGame } from "../context/GameContext.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faHome } from "@fortawesome/free-solid-svg-icons";

const EndReasons = {
	["time"]: "Aeg sai otsa!",
	["answer"]: "Vastasid valesti!",
};

const EndGame = () => {
	const [searchParams] = useSearchParams();
	const endReasonText = EndReasons[searchParams.get("reason")] || "Mäng läbi!";
	const { startGame } = useGame();
	const navigate = useNavigate();

	const isNewHighScore = false;
	const completionTime = 0;

	const [meme, setMeme] = useState({
		url: null,
		name: "",
	});

	const fetchRandomMeme = async () => {
		try {
			const response = await fetch("https://api.imgflip.com/get_memes");
			const { success, data } = await response.json();
			if (success && data.memes.length > 0) {
				const randomMeme =
					data.memes[Math.floor(Math.random() * data.memes.length)];
				return randomMeme;
			}
		} catch (error) {
			console.error("Error fetching meme:", error);
		}

		return null;
	};

	useEffect(() => {
		const loadMeme = async () => {
			const randomMeme = await fetchRandomMeme();
			if (randomMeme) {
				const img = new Image();
				img.src = randomMeme.url;
				img.onload = () =>
					setMeme({ url: randomMeme.url, name: randomMeme.name });
			}
		};

		loadMeme();

		const saveResult = () => {
			/* 	const difficulty = localStorage.getItem("difficulty") || "medium";
			fetch("/api/submit-score", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: localStorage.getItem("username"),
					score: localStorage.getItem("highestPoints"),
					difficulty: difficulty,
					completion_time: completionTime,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Result saved:", data);

					localStorage.setItem(
						"lastHighScore",
						localStorage.getItem("highestPoints") || 0
					);

					alert("Uus rekord on salvestatud!");
				})
				.catch((error) => {
					console.error("Error saving result:", error);
				}); */
		};

		if (isNewHighScore) saveResult();
	}, [isNewHighScore, completionTime]);

	return (
		<div className='flex flex-col items-center justify-between h-full bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4'>
			<div className='flex flex-col justify-center items-center w-full'>
				<h1 className='text-[2.5rem] md:text-6xl font-bold bg-linear-to-r from-red-400 to-violet-300 text-transparent bg-clip-text'>
					{endReasonText}
				</h1>
			</div>

			<div className='flex flex-col justify-center items-center w-full'>
				<img
					src={meme.url}
					alt={meme.name}
					className='rounded-lg shadow-lg w-full h-auto max-w-xs max-h-[360px] my-4'
				/>
			</div>

			<div className='flex flex-col sm:flex-row justify-center items-center w-full sm:w-1/2'>
				<button
					type='button'
					className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer transition-colors'
					onClick={() => startGame("medium")}
				>
					<FontAwesomeIcon icon={faRepeat} size='xl' className='me-2' /> Uuesti
				</button>

				<button
					type='button'
					className='bg-red-500 hover:bg-red-600 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer transition-colors'
					onClick={() => navigate("/")}
				>
					<FontAwesomeIcon icon={faHome} size='xl' className='me-2' />
					Tagasi
				</button>
			</div>
		</div>
	);
};

export default EndGame;
