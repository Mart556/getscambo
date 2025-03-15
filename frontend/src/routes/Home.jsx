import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Home = ({ onStartGame }) => {
    const [userName, setUserName] = useState(
        localStorage.getItem("username") || ""
    );

    useEffect(() => {
        localStorage.setItem("username", userName);
    }, [userName]);

    const handleStartGame = () => {
        console.log("Starting the game with username:", userName);
        if (userName.length > 3) {
            localStorage.setItem("username", userName);
            onStartGame();
            return;
        } else {
            alert(
                "Sisesta kasutajnimi ja proovi uuesti! \nKasutajanimi peab olema vähemalt 4 tähemärki pikk."
            );
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-8 h-screen flex flex-col">
            <div className="flex flex-col justify-center pt-4">
                <div className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg md:w-3/6 lg:w-1/3 mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        GetScambod
                    </h1>
                </div>

                <p className="text-gray-400 text-lg md:text-xl mt-2 text-center">
                    Kas scam või mitte scam?
                </p>
            </div>

            <div className="flex justify-center my-20">
                <div className="flex flex-col items-center w-full max-w-xs">
                    <input
                        type="text"
                        className="border-2 border-gray-600 p-2 rounded-lg text-center w-full bg-gray-800 text-white"
                        placeholder="Sisesta Kasutajanimi"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                    />
                    <button
                        onClick={handleStartGame}
                        className="bg-green-500 p-4 md:p-8 py-3 md:py-4 rounded-lg mt-2 w-full cursor-pointer"
                    >
                        <span className="text-xl md:text-2xl font-bold text-white flex items-center justify-center">
                            Mängima{" "}
                            <FontAwesomeIcon icon={faPlay} className="ml-2" />
                        </span>
                    </button>
                </div>
            </div>

            {/* Scoreboard section */}
            <div className="flex justify-center my-3 md:my-4 flex-grow overflow-hidden">
                <div className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg w-full max-w-lg flex flex-col">
                    <h2 className="text-xl text-center md:text-2xl font-bold text-white">
                        Edetabel
                    </h2>
                    <hr className="border-gray-600 mt-1" />
                    <div className="flex flex-col mt-2">
                        {/* Scoreboard content will go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
