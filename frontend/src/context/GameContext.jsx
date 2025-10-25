import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameContext = createContext();

const DIFFICULTY_LEVELS = {
	easy: 120000,
	medium: 60000,
	hard: 30000,
};

export function GameProvider({ children }) {
	const navigate = useNavigate();

	const [isGameActive, setGameActive] = useState(false);
	const [gameDifficulty, setGameDifficulty] = useState("");
	const [gameTime, setGameTime] = useState(0);
	const [currentImage, setCurrentImage] = useState("");
	const [highestPoints, setHighestPoints] = useState(0);
	const [currentPoints, setCurrentPoints] = useState(0);

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

	const startGame = (difficulty) => {
		const gameTime = DIFFICULTY_LEVELS[difficulty];
		if (!gameTime) return;

		setGameDifficulty(difficulty);
		setGameTime(gameTime);
		setCurrentPoints(0);
		setCurrentImage(chooseRandomImage());
		setGameActive(true);

		navigate("/start");
	};

	const finishGame = (badAnswer) => {
		setGameActive(false);

		// TODO: Fetch server to update leaderboard

		const newHighscore = currentPoints > highestPoints;
		if (newHighscore) {
			setHighestPoints(currentPoints);
		}

		if (badAnswer) {
			navigate("/end?reason=answer&points=" + currentPoints);
		} else {
			navigate("/end?reason=time&points=" + currentPoints);
		}
	};

	const answerQuestion = (answer) => {
		fetch("/api/validate-answer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				answer,
				image: currentImage.split("/").pop(),
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data) {
					console.error("No data received from the server");
					return window.location.assign("/404");
				}

				if (data.isCorrect) {
					const newPoints = currentPoints + 1;
					setCurrentPoints(newPoints);

					const imgElement = document.querySelector("img");
					const newImage = new Image();
					newImage.src = getImagePath(data.nextImage);

					const animateImageTransition = () => {
						imgElement.style.transition = "transform 0.5s ease-in-out";
						imgElement.style.transform = "translateX(-100%)";

						newImage.onload = () => {
							setTimeout(() => {
								setImage(data.nextImage);

								imgElement.style.visibility = "hidden";
								resetImageStyles();
							}, 500);
						};
					};

					const resetImageStyles = () => {
						imgElement.style.transition = "none";
						imgElement.style.transform = "translateX(100%)";

						setTimeout(() => {
							imgElement.style.visibility = "visible";
							imgElement.style.transition = "transform 0.5s ease-in-out";
							imgElement.style.transform = "translateX(0)";
							setBtnDisabled(false);
						}, 50);
					};

					animateImageTransition();
				} else {
					finishGame();
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				window.location.assign("/404");
			});
	};

	return (
		<GameContext.Provider
			value={{
				isGameActive,
				gameDifficulty,
				gameTime,
				currentImage,
				highestPoints,
				startGame,
				finishGame,
				answerQuestion,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}

export function useGame() {
	return useContext(GameContext);
}
