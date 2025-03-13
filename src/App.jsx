import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
    // TODO 2: Display top 10 users in the Scoreboard
    // TODO 3: Implement the game logic
    // TODO 4: Implement the game UI

    const startGame = () => {
        console.log("Game started");
    };

    //const topPlayers = [];

    useEffect(() => {
        // TODO 1: Fetch top 10 users from the server
    }, []);

    return (
        <>
            <div className="container px-4 md:px-8 h-screen flex flex-col bg-gray-900">
                <div className="flex flex-col justify-center pt-4">
                    <div className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg  md:w-3/4 lg:w-1/2 mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-white">
                            GetScambod
                        </h1>
                    </div>

                    <p className="text-gray-400 text-lg md:text-xl mt-2 text-center">
                        Kas scam või mitte scam?
                    </p>
                </div>

                <div className="flex justify-center mt-3 md:mt-4">
                    <div className="flex flex-col items-center w-full max-w-xs">
                        <input
                            type="text"
                            className="border-2 border-gray-600 p-2 rounded-lg text-center w-full bg-gray-800 text-white"
                            placeholder="Sisesta Kasutajanimi"
                        />
                        <button
                            onClick={startGame}
                            className="bg-green-500 p-4 md:p-8 py-3 md:py-4 rounded-lg mt-2 w-full cursor-pointer"
                        >
                            <span className="text-xl md:text-2xl font-bold text-white flex items-center justify-center">
                                Mängima{" "}
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="ml-2"
                                />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-center my-3 md:my-4 flex-grow overflow-hidden">
                    <div className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg w-full max-w-xs flex flex-col">
                        <h2 className="text-xl text-center md:text-2xl font-bold text-white">
                            Edetabel
                        </h2>

                        <hr className="border-gray-600 mt-1" />

                        <div className="flex flex-col mt-2">
                            {/* {topPlayers.map((player, index) => (
								<div key={index} className="flex justify-between">
									<span className="text-white">{player.name}</span>
									<span className="text-white">{player.score}</span>
							}))} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
