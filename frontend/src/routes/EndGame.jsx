import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faHome } from "@fortawesome/free-solid-svg-icons";

const EndGame = ({ isNewHighScore, currentPoints }) => {
    const saveResult = () => {
        // TODO: Implement saving the result to the backend
        console.log(
            "Saving the result to the backend server...",
            currentPoints,
            localStorage.getItem("username")
        );
    };

    const [meme, setMeme] = useState("null");

    const fetchRandomMeme = async () => {
        try {
            const response = await fetch("https://api.imgflip.com/get_memes");
            const data = await response.json();
            if (data.success) {
                const memes = data.data.memes;
                const randomIndex = Math.floor(Math.random() * memes.length);
                setMeme(memes[randomIndex]);
            }
        } catch (error) {
            console.error("Error fetching meme:", error);
        }
    };

    useEffect(() => {
        fetchRandomMeme();

        return () => {
            if (isNewHighScore) saveResult();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg shadow-lg p-4 my-4">
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-7xl font-bold text-white">Mäng läbi!</h1>

                <img
                    src={meme.url}
                    alt={meme.name}
                    className="rounded-lg shadow-lg w-full h-auto max-w-xs my-4"
                />
            </div>

            <div className="flex flex-row justify-center items-center w-1/2">
                <button
                    className="bg-blue-500 text-white font-bold py-4 w-75 rounded m-3 text-2xl"
                    onClick={() => window.location.reload()}
                >
                    <FontAwesomeIcon
                        icon={faRepeat}
                        size="xl"
                        className="me-2"
                    />{" "}
                    Uuesti Mängima
                </button>

                <button
                    className="bg-red-500 text-white font-bold py-4 w-75 rounded m-3 text-2xl"
                    onClick={() => window.location.assign("/")}
                >
                    <FontAwesomeIcon icon={faHome} size="xl" className="me-2" />
                    Tagasi
                </button>
            </div>
        </div>
    );
};

export default EndGame;
