import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faHome } from "@fortawesome/free-solid-svg-icons";

const EndReasons = {
    ["time"]: "Aeg sai otsa!",
    ["answer"]: "Vastasid valesti!",
};

const EndGame = ({ isNewHighScore, endReason }) => {
    const endReasonText = EndReasons[endReason] || "Mäng läbi!";

    useEffect(() => {
        fetchRandomMeme();

        const saveResult = () => {
            fetch("/api/submit-score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username"),
                    score: localStorage.getItem("highestPoints"),
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
                });
        };

        if (isNewHighScore) saveResult();
    }, []);

    const [meme, setMeme] = useState("");

    const fetchRandomMeme = async () => {
        try {
            const response = await fetch("https://api.imgflip.com/get_memes");
            const { success, data } = await response.json();
            if (success) {
                const memes = data.memes;
                const randomIndex = Math.floor(Math.random() * memes.length);
                const selectedMeme = memes[randomIndex];

                const img = new Image();
                img.src = selectedMeme.url;
                img.onload = () => setMeme(selectedMeme);
            }
        } catch (error) {
            console.error("Error fetching meme:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-evenly h-full bg-neutral-800/75  backdrop-filter backdrop-blur-lg  rounded-lg shadow-lg p-4 my-4">
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-[2.5rem] md:text-6xl font-bold bg-gradient-to-r from-red-300 to-violet-300 text-transparent bg-clip-text underline underline-offset-12">
                    {endReasonText}
                </h1>
            </div>

            <div className="flex flex-col justify-center items-center w-full">
                <img
                    src={meme.url}
                    alt={meme.name}
                    className="rounded-lg shadow-lg w-full h-auto max-w-xs max-h-[360px] my-4"
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center w-full sm:w-1/2">
                <button
                    className="bg-blue-500 text-white font-bold py-4 w-full sm:w-75 rounded m-3 text-2xl"
                    onClick={() => window.location.reload()}
                >
                    <FontAwesomeIcon
                        icon={faRepeat}
                        size="xl"
                        className="me-2"
                    />{" "}
                    Uuesti
                </button>

                <button
                    className="bg-red-500 text-white font-bold py-4 w-full sm:w-75 rounded m-3 text-2xl"
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
