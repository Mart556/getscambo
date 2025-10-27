import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

const GameContext = createContext();

import DIFFICULTY_LEVELS from "../assets/difficulties.json";

export function GameProvider({ children }) {
	const navigate = useNavigate();

	const [isGameActive, setGameActive] = useState(false);
	const [gameDifficulty, setGameDifficulty] = useState("");
	const [gameTime, setGameTime] = useState(0);
	const [currentImage, setCurrentImage] = useState("");
	const [highestPoints, setHighestPoints] = useState(0);
	const [currentPoints, setCurrentPoints] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [preloadedMeme, setPreloadedMeme] = useState(null);
	const [isImageLoading, setIsImageLoading] = useState(false);

	const chooseRandomImage = () => {
		const context = import.meta.glob("../../public/*.{webp,png,jpg,jpeg,svg}");
		const imagePaths = Object.keys(context);
		if (imagePaths.length > 0) {
			const randomImage =
				imagePaths[Math.floor(Math.random() * imagePaths.length)];
			const imageName = randomImage.split("/").pop();
			const imagePath = `./${imageName}`;
			return imagePath;
		}

		return null;
	};

	const fetchRandomMeme = async () => {
		try {
			const response = await fetch("https://api.imgflip.com/get_memes");
			const { success, data } = await response.json();
			if (success && data.memes.length > 0) {
				const randomMeme =
					data.memes[Math.floor(Math.random() * data.memes.length)];
				return new Promise((resolve) => {
					const img = new Image();
					img.src = randomMeme.url;
					img.onload = () => {
						resolve({ url: randomMeme.url, name: randomMeme.name });
					};
					img.onerror = () => {
						resolve({ url: randomMeme.url, name: randomMeme.name });
					};
				});
			}
		} catch (error) {
			console.error("Error fetching meme:", error);
		}

		return null;
	};

	const startGame = (difficulty) => {
		const difficultyLevel = DIFFICULTY_LEVELS[difficulty];
		if (!difficultyLevel)
			return console.error("Invalid difficulty level:", difficulty);

		setStartTime(Date.now());
		setGameDifficulty(difficulty);
		setGameTime(difficultyLevel.time * 1000);
		setCurrentPoints(0);
		setCurrentImage(chooseRandomImage());
		setGameActive(true);

		navigate("/start");
	};

	const finishGame = async (badAnswer) => {
		setGameActive(false);

		const newHighscore = currentPoints > localStorage.getItem("highestPoints");
		if (newHighscore) {
			setHighestPoints(currentPoints);
			localStorage.setItem("highestPoints", currentPoints);

			console.log("Submitting score:", {
				score: currentPoints,
				difficulty: gameDifficulty,
				completion_time: startTime ? (Date.now() - startTime) / 1000 : null,
			});

			fetch("/api/submit-score", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					score: currentPoints,
					difficulty: gameDifficulty,
					completion_time: startTime ? (Date.now() - startTime) / 1000 : null,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (response.ok) {
						console.log("Result saved:", data);
						alert("Uus rekord! Sinu tulemus on salvestatud edetabelisse.");
					}
				})
				.catch((error) => {
					console.error("Error submitting score:", error);
				});
		}

		const meme = await fetchRandomMeme();
		setPreloadedMeme(meme);

		if (badAnswer) {
			navigate("/end?reason=answer&points=" + currentPoints);
		} else {
			navigate("/end?reason=time&points=" + currentPoints);
		}
	};

	const answerQuestion = (answer) => {
		console.log("Submitting answer:", answer, "for image:", currentImage);
		fetch("/api/validate-answer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				answer,
				image: currentImage.split("/").pop(),
			}),
		})
			.then((response) => {
				console.log("Response status:", response.status, response.statusText);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				console.log("Answer validation response:", data);
				if (data && data.isCorrect) {
					setCurrentPoints(currentPoints + 1);
					setCurrentImage(data.nextImage);
				} else {
					finishGame(true);
				}
			})
			.catch((error) => {
				console.error("Error in answerQuestion:", error);
				console.error("Error message:", error.message);
				console.error("Error stack:", error.stack);
			});
	};

	return (
		<GameContext.Provider
			value={{
				currentPoints,
				isGameActive,
				gameDifficulty,
				gameTime,
				currentImage,
				highestPoints,
				startGame,
				finishGame,
				answerQuestion,
				preloadedMeme,
				setPreloadedMeme,
				isImageLoading,
				setIsImageLoading,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}

export function useGame() {
	return useContext(GameContext);
}
