import { useState, useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../../context/GameContext.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCrown } from "@fortawesome/free-solid-svg-icons";

import { IoLogInOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.jsx";

import Header from "./Header.jsx";
import Leaderboard from "./Leaderboard.jsx";

import DIFFICULTY_LEVELS from "../../assets/difficulties.json";

const Home = () => {
	const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
	const [showLeaderboard, setShowLeaderboard] = useState(false);

	const navigate = useNavigate();
	const { startGame } = useGame();
	const { isLoggedIn, user } = useAuth();

	return (
		<div className='min-h-screen flex flex-col  dark:bg-gray-900 text-black dark:text-white'>
			<Header />

			<main className='flex-1 flex items-center justify-center px-4 md:px-8 py-8'>
				<div className='w-full max-w-7xl'>
					<div className='text-center mb-12'>
						<h1 className='text-5xl md:text-7xl font-bold mb-4'>GetScambod</h1>
						<p className='text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-semibold'>
							Kas tegemist on õngitsus kirjaga? 🕵️
						</p>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='lg:col-span-2'>
							{isLoggedIn ? (
								<div className=' dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
									<h2 className='text-2xl md:text-3xl font-bold mb-6'>
										Alusta mängu
									</h2>

									{/* Difficulty Selector */}
									<div className='mb-8'>
										<label className='block text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300'>
											Vali raskusaste:
										</label>
										<div className='grid grid-cols-3 gap-4'>
											{Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
												<button
													key={key}
													onClick={() => setSelectedDifficulty(key)}
													className={`p-4 rounded-lg font-semibold transition-all transform text-center ${
														selectedDifficulty === key
															? `${value.color} text-white scale-105 shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-${value.color}`
															: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105"
													}`}
												>
													<div className='text-3xl mb-2'>{value.icon}</div>
													<div className='text-sm font-bold'>{value.label}</div>
													<div className='text-xs opacity-75 mt-1'>
														{value.time}s
													</div>
												</button>
											))}
										</div>
									</div>

									<button
										type='button'
										onClick={() => startGame(selectedDifficulty)}
										disabled={!isLoggedIn}
										className='w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 md:py-5 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg md:text-xl shadow-lg'
									>
										<FontAwesomeIcon icon={faPlay} className='me-3' />
										Mängima
									</button>

									<button
										type='button'
										onClick={() => setShowLeaderboard(true)}
										className='w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 md:py-4 rounded-lg lg:hidden transition-all text-base md:text-lg'
									>
										<FontAwesomeIcon icon={faCrown} className='me-2' />
										Vaata Edetabelit
									</button>
								</div>
							) : (
								<div className='bg-linear-to-br  dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-lg border-2 border-dashed border-blue-300 dark:border-gray-600 text-center'>
									<p className='text-xl md:text-2xl font-bold mb-6'>
										Logi sisse, et mängida!
									</p>
									<button
										onClick={() => navigate("/auth")}
										className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center mx-auto shadow-lg'
									>
										<IoLogInOutline className='inline-block mr-2 text-2xl' />
										Registreeru või Logi Sisse
									</button>
								</div>
							)}
						</div>

						<div className='lg:col-span-1 hidden lg:block'>
							<Leaderboard isDesktop={true} />
						</div>
					</div>
				</div>
			</main>

			{showLeaderboard && (
				<Leaderboard
					isDesktop={false}
					onClose={() => setShowLeaderboard(false)}
					showLeaderboard={showLeaderboard}
				/>
			)}
		</div>
	);
};

export default Home;
