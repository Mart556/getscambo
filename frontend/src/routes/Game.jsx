import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import needHelpImage from "../assets/needhelp.jpg";
function Game() {
    const [points] = useState(0);
    const [time, setTime] = useState(0);

    useEffect(() => {
        const timeStarted = new Date().getTime();

        const updateTime = () => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - timeStarted;
            setTime(timeDiff);
        };

        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-8 h-screen flex flex-col bg-gray-900">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4 flex flex-row justify-between">
                <div className="flex justify-start items-center">
                    <p className="text-white m-0 text-xl font-bold me-4">
                        <FontAwesomeIcon icon={faStopwatch} size="2xl" />{" "}
                        {Math.floor(time / 1000)}s
                    </p>

                    <p className="text-2xl font-bold text-white">
                        Punkte: {points}
                    </p>
                </div>

                <div className="flex justify-self-end items-center w-1/4">
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-green-500 h-full"
                            style={{ width: `${(time / 60000) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center justify-center h-full bg-gray-800 rounded-lg shadow-lg p-4 my-4">
                <div className="flex flex-col justify-center items-center w-1/2">
                    <h1 className="text-4xl font-bold text-white">Question?</h1>

                    <hr className="w-full my-4 border-white" />

                    <img
                        className=" rounded-lg shadow-lg"
                        src={needHelpImage}
                        alt="React Logo"
                    />
                </div>

                <div className="flex flex-col justify-center items-center w-1/2">
                    <button className="bg-green-500 text-white font-bold py-5 w-75 rounded m-3">
                        Bueno
                    </button>
                    <button className="bg-red-500 text-white font-bold py-5 w-75 rounded m-3">
                        No Bueno
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Game;
