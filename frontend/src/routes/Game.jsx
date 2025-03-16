import { useState, memo } from "react";

const Game = memo(({ onGameRunningChange, incrementCurrentPoints }) => {
    const [currentImage, setImage] = useState("pzu1.webp");

    const getImagePath = (imageName) => {
        return `./${imageName}`;
    };

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
                } else {
                    endGame();
                }

                setImage(data.nextImage);
            })
            .catch((error) => {
                console.error("Error:", error);
                window.location.href = "/404";
            });
    };

    const endGame = () => {
        onGameRunningChange(false, "answer");
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between md:justify-center h-full bg-neutral-800/75  backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 my-4">
            <div className="flex flex-col justify-center items-center w-full md:w-1/2">
                <img
                    className="rounded-lg shadow-lg w-full h-full md:h-auto max-w-3xs md:max-w-2xs h-max-[360px] my-4"
                    src={getImagePath(currentImage)}
                    alt="Question"
                />
            </div>

            <div className="flex flex-row md:flex-col justify-center items-center w-full md:w-1/2">
                <button
                    onClick={() => validateAnswer(true)}
                    className="bg-green-500 text-white font-bold py-5 w-75 rounded m-3"
                >
                    Bueno
                </button>

                <button
                    onClick={() => validateAnswer(false)}
                    className="bg-red-500 text-white font-bold py-5 w-75 rounded m-3"
                >
                    No Bueno
                </button>
            </div>
        </div>
    );
});

export default Game;
