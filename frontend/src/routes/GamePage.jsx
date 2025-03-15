import { useState, useEffect, useRef, useCallback } from "react";
import Game from "./Game";
import EndGame from "./EndGame";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

const GamePage = () => {
    const [isGameRunning, setGameRunning] = useState(true);
    const [gameEndReason, setGameEndReason] = useState("");

    const handleGameRunningChange = useCallback((isRunning, reason = "") => {
        setGameRunning(isRunning);
        setGameEndReason(reason);
        clearInterval(intervalRef.current);
    }, []);

    const [currentPoints, setPoints] = useState(0);

    const handlePointsChange = useCallback(() => {
        setPoints((prevPoints) => prevPoints + 1);
    }, []);

    const [highestPoints, setHighestPoints] = useState(
        localStorage.getItem("highestPoints") || 0
    );

    useEffect(() => {
        if (currentPoints > highestPoints) {
            setHighestPoints(currentPoints);
            localStorage.setItem("highestPoints", currentPoints);
        }
    }, [currentPoints, highestPoints]);

    const [timeLeft, setTime] = useState(0);

    const intervalRef = useRef(null);

    useEffect(() => {
        const countdownTime = 60000;
        const endTime = Date.now() + countdownTime;

        const updateTime = () => {
            const currentTime = Date.now();
            const timeLeft = endTime - currentTime;
            setTime(timeLeft > 0 ? timeLeft : 0);

            if (timeLeft <= 0) {
                handleGameRunningChange(false, "time");
            }
        };

        intervalRef.current = setInterval(updateTime, 1000);
        updateTime();

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <>
            <div className="container mx-auto px-4 md:px-8 h-screen flex flex-col bg-gray-900 max-h-screen">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4 flex flex-row justify-between">
                    <div className="flex justify-start items-center">
                        <p className="text-2xl font-bold text-white me-3">
                            Punkte: {currentPoints}
                        </p>

                        <p className="text-2xl font-bold text-white">
                            Rekord: {highestPoints}
                        </p>
                    </div>

                    <div className="flex justify-self-end items-center w-1/4">
                        <FontAwesomeIcon
                            icon={faStopwatch}
                            size="xl"
                            className="text-white me-3"
                        />{" "}
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-green-500 h-full"
                                style={{
                                    width: `${(timeLeft / 60000) * 100}%`,
                                    transition: "width 0.5s linear",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {isGameRunning ? (
                    <Game
                        onGameRunningChange={handleGameRunningChange}
                        incrementCurrentPoints={handlePointsChange}
                    />
                ) : (
                    <EndGame
                        isNewHighScore={
                            currentPoints >
                            localStorage.getItem("lastHighScore")
                        }
                        endReason={gameEndReason}
                    />
                )}
            </div>
        </>
    );
};

export default GamePage;
