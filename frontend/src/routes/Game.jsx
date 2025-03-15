import { useState } from "react";

const Game = ({ onGameRunningChange, incrementCurrentPoints }) => {
    const [currentImage, setImage] = useState("pzu1.webp");

    const getImagePath = (imageName) => {
        try {
            return `/src/assets/${imageName}`;
        } catch (error) {
            console.error("Error getting image path:", error);
            return `/src/assets/${imageName}`;
        }
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

                console.log("Server response:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
                window.location.href = "/404";
            });
    };

    const endGame = () => {
        onGameRunningChange(false);
    };

    return (
        <div className="flex flex-row items-center justify-center h-full bg-gray-800 rounded-lg shadow-lg p-4 my-4">
            <div className="flex flex-col justify-center items-center w-1/2">
                <img
                    className="rounded-lg shadow-lg w-full h-auto max-w-xs"
                    src={getImagePath(currentImage)}
                    alt="Question"
                />
            </div>

            <div className="flex flex-col justify-center items-center w-1/2">
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
};

export default Game;
