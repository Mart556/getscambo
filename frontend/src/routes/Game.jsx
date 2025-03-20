import { useState, memo, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Game = memo(({ onGameRunningChange, incrementCurrentPoints }) => {
    const [currentImage, setImage] = useState("");

    const getImagePath = (imageName) => {
        return `./${imageName}`;
    };

    useEffect(() => {
        const images = [
            "0.4.webp",
            "0.13.webp",
            "0.14.webp",
            "1.2.webp",
            "1.16.webp",
            "1.21.webp",
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

                    const imgElement = document.querySelector("img");
                    imgElement.style.transition = "transform 0.5s ease-in-out";
                    imgElement.style.transform = "translateX(-100%)";
                    setTimeout(() => {
                        setImage(data.nextImage);
                        imgElement.style.visibility = "hidden";
                        imgElement.style.transition = "none";
                        imgElement.style.transform = "translateX(100%)";
                        setTimeout(() => {
                            imgElement.style.visibility = "visible";
                            imgElement.style.transition =
                                "transform 0.5s ease-in-out";
                            imgElement.style.transform = "translateX(0)";
                        }, 50);
                    }, 500);
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
        <div className="game-screen flex flex-col items-center justify-between h-full bg-neutral-800/75 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4">
            <div className="flex grow justify-center items-center w-full">
                <Zoom>
                    <img
                        className="rounded-lg max-w-[300px] max-h-[400px] object-contain"
                        src={getImagePath(currentImage)}
                        alt="Question"
                    />
                </Zoom>
            </div>

            <div className="flex flex-row justify-center items-center w-full">
                <button
                    onClick={() => validateAnswer(true)}
                    className="bg-green-500 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer"
                >
                    <FontAwesomeIcon icon={faThumbsUp} /> Legit
                </button>

                <button
                    onClick={() => validateAnswer(false)}
                    className="bg-red-500 text-white font-bold py-5 w-75 rounded m-3 text-2xl cursor-pointer"
                >
                    <FontAwesomeIcon icon={faThumbsDown} /> Scam
                </button>
            </div>
        </div>
    );
});

export default Game;
