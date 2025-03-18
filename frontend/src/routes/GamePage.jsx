import { useState, useEffect, useRef, useCallback } from "react";
import Game from "./Game";
import EndGame from "./EndGame";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

const Time = 60000;

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

    const [timeLeft, setTime] = useState(Time);
    const intervalRef = useRef(null);

    useEffect(() => {
        const updateTime = () => {
            setTime((prevTime) => {
                if (prevTime <= 0) {
                    handleGameRunningChange(false, "time");
                    return 0;
                }

                return prevTime - 1000;
            });
        };

        intervalRef.current = setInterval(updateTime, 1000);

        return () => clearInterval(intervalRef.current);
    }, [handleGameRunningChange]);

    return (
        <>
            <div className="container mx-auto px-4 md:px-8 h-screen flex flex-col max-h-screen">
                <div className="bg-neutral-800/75  backdrop-filter backdrop-blur-lg  p-4 rounded-lg shadow-lg mt-4 flex flex-row justify-between">
                    <div className="flex justify-start items-center">
                        <p className="text-xl md:text-2xl font-bold text-white me-3">
                            Punkte: {currentPoints}
                        </p>

                        <p className="text-xl md:text-2xl font-bold text-white">
                            Rekord: {highestPoints}
                        </p>
                    </div>

                    <div className="flex justify-self-end items-center w-2/5 md:w-1/4">
                        <FontAwesomeIcon
                            icon={faStopwatch}
                            size="xl"
                            className="text-white me-3"
                        />{" "}
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full ${
                                    timeLeft < 10000
                                        ? "bg-red-500 blink"
                                        : timeLeft < Time / 2
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`}
                                style={{
                                    width: `${(timeLeft / Time) * 100}%`,
                                    transition: "width 1s linear",
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
