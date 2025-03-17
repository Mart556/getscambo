import { useState, memo, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const Game = memo(({ onGameRunningChange, incrementCurrentPoints }) => {
    const [currentImage, setImage] = useState("");

    const getImagePath = (imageName) => {
        return `./${imageName}`;
    };

    useEffect(() => {
        const images = [
            "0.1.webp",
            "0.12.webp",
            "0.14.webp",
            "0.20.webp",
            "0.21.webp",
        ];
        const getRandomImage = () =>
            images[Math.floor(Math.random() * images.length)];

        setImage(getRandomImage());
    }, []);

    const validateAnswer = (answer) => {
        fetch("/api/validate-answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer, image: currentImage }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data) {
                    console.error("No data received from the server");
                    return;
                }

                if (data.isCorrect) {
                    incrementCurrentPoints();
                    setImage(data.nextImage);
                } else {
                    endGame();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                window.location.assign("/404");
            });
    };

    const endGame = () => {
        onGameRunningChange(false, "answer");
    };

    return (
        <div className="game-screen flex flex-col md:flex-row items-center justify-between md:justify-center h-full bg-neutral-800/75  backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4">
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 ">
                <img
                    className="rounded-lg shadow-lg w-full h-auto max-w-3xs md:max-w-xs h-max-[360px] my-4 object-cover"
                    src={getImagePath(currentImage)}
                    alt="Question"
                />

                {/* <p className="text-2xl md:text-4xl font-bold text-white">
                    Is this meme legit or a scam?
                </p> */}
            </div>

            <div className="flex flex-row md:flex-col justify-center items-center w-full md:w-1/2">
                <button
                    onClick={() => validateAnswer(true)}
                    className="bg-green-500 text-white font-bold py-5 w-75 rounded m-3 text-2xl"
                >
                    <FontAwesomeIcon icon={faThumbsUp} /> Legit
                </button>

                <button
                    onClick={() => validateAnswer(false)}
                    className="bg-red-500 text-white font-bold py-5 w-75 rounded m-3 text-2xl"
                >
                    <FontAwesomeIcon icon={faThumbsDown} /> Scam
                </button>
            </div>
        </div>
    );
});

export default Game;
