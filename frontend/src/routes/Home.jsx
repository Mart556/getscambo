import { useState, useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router";
import LightSwitch from "./LightSwitch";
import { useGame } from "../context/GameContext.jsx";

const GitAPI = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";

import { AiOutlineInfo } from "react-icons/ai";
import { useAuth } from "../context/AuthContext.jsx";

const DIFFICULTY_LEVELS = {
	easy: { label: "Lihtne", time: 120, icon: "😊", color: "bg-green-500" },
	medium: { label: "Keskmine", time: 60, icon: "⚡", color: "bg-green-500" },
	hard: { label: "Raske", time: 30, icon: "🔥", color: "bg-green-500" },
};

const Home = () => {
	const [userName, setUserName] = useState(
		localStorage.getItem("username") || ""
	);
	const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

	const { isLoggedIn, logout, user } = useAuth();

	const setUserName2 = useEffectEvent(() => {
		setUserName(user.username);
	});

	useEffect(() => {
		if (user && user.username) {
			setUserName2(user.username);
		}
	}, [isLoggedIn, user]);

	const [leaderboardUsers, setLeaderboardUsers] = useState([]);

	useEffect(() => {
		localStorage.setItem(
			"lastHighScore",
			localStorage.getItem("highestPoints") || 0
		);

		fetch("http://localhost:3000/api/get-highscores")
			.then((response) => response.json())
			.then((leaderBoardData) => {
				if (
					!leaderBoardData ||
					!Array.isArray(leaderBoardData) ||
					leaderBoardData.length === 0
				)
					return;

				const leaderboardUsers = leaderBoardData.map((user) => ({
					username: user.username,
					score: user.score,
					difficulty: user.difficulty,
					completion_time: user.completion_time,
				}));

				setLeaderboardUsers(leaderboardUsers);
			})
			.catch((error) => {
				console.error("Error fetching highscores:", error);
			});
	}, []);

	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const navigate = useNavigate();

	const { startGame } = useGame();

	return (
		<div className='container mx-auto px-8 md:px-10 h-screen flex justify-center items-center overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white'>
			<div className='absolute top-4 right-4 flex items-center justify-between space-x-4'>
				<button
					className='cursor-pointer rounded-full bg-gray-200 dark:bg-gray-800 p-2 px-3 border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors'
					onClick={() => (isLoggedIn ? logout() : navigate("/auth"))}
				>
					{isLoggedIn ? "Logi Välja" : "Registreeru/Logi Sisse"}
				</button>

				<LightSwitch />

				<a
					href='#'
					rel='noopener noreferrer'
					onClick={() => {
						navigate("/info");
					}}
					className='p-2 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-800 text-black dark:text-white text-3xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors'
				>
					<AiOutlineInfo />
				</a>
			</div>

			<div className='flex flex-col justify-self-center justify-center items-center h-full'>
				<div className='flex flex-col justify-center pt-4'>
					<h1 className='text-5xl md:text-6xl font-bold mx-auto rounded-lg px-6 py-8'>
						GetScambod{" "}
						<span className='p-4 bg-gray-700 dark:bg-gray-800 text-neutral-200 border-2 border-gray-500 dark:border-gray-600 rounded-full italic'>
							V3
						</span>
					</h1>

					<div className='flex justify-center align-center rounded-4xl backdrop-filter backdrop-blur-lg max-w-fit mx-auto p-3 px-4'>
						<p className='font-bold text-lg md:text-xl text-center'>
							Kas scam või mitte scam?
						</p>
					</div>
				</div>

				{isLoggedIn && (
					<div className='flex justify-center my-10'>
						<div className='flex flex-col items-center w-full max-w-md gap-4'>
							<div className='w-full'>
								<p className='text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
									Valige Raskusaste:
								</p>
								<div className='grid grid-cols-3 gap-2'>
									{Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
										<button
											key={key}
											onClick={() => setSelectedDifficulty(key)}
											className={`p-3 rounded-lg font-semibold transition-all transform ${
												selectedDifficulty === key
													? `${value.color} text-white scale-105 shadow-lg`
													: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
											}`}
										>
											<div className='text-xl mb-1'>{value.icon}</div>
											<div className='text-xs'>{value.label}</div>
											<div className='text-xs'>({value.time}s)</div>
										</button>
									))}
								</div>
							</div>

							{/* Start Game Button */}
							<button
								type='button'
								onClick={() => startGame(selectedDifficulty)}
								disabled={!isLoggedIn}
								className='p-4 md:p-6 py-3 md:py-4 rounded-lg w-full cursor-pointer transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 text-white font-bold'
							>
								<span className='text-xl md:text-2xl font-bold text-white flex items-center justify-center'>
									<FontAwesomeIcon icon={faPlay} className='me-2' />
									Mängima
								</span>
							</button>

							{/* Leaderboard Button (Mobile) */}
							<button
								type='button'
								onClick={() => setShowLeaderboard(true)}
								className='bg-blue-500 hover:bg-blue-600 p-4 md:p-6 py-3 md:py-4 rounded-lg w-full cursor-pointer xl:hidden transition-all text-white font-bold'
							>
								<span className='text-xl md:text-2xl font-bold text-white flex items-center justify-center'>
									<FontAwesomeIcon icon={faCrown} className='me-2' />
									Edetabel
								</span>
							</button>

							{/* Mobile Leaderboard Modal */}
							{showLeaderboard && (
								<div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 xl:hidden px-4'>
									<div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-96 overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-700'>
										<div className='flex justify-between items-center mb-6'>
											<h2 className='text-2xl md:text-3xl font-bold flex items-center gap-2'>
												<FontAwesomeIcon
													icon={faCrown}
													className='text-yellow-500'
												/>
												Edetabel
											</h2>
											<button
												onClick={() => setShowLeaderboard(false)}
												className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
											>
												<FontAwesomeIcon icon={faTimes} size='lg' />
											</button>
										</div>
										<hr className='border-gray-300 dark:border-gray-600 mb-4' />
										<div className='flex flex-col gap-3'>
											{leaderboardUsers.length === 0 ? (
												<p className='text-center text-gray-500 dark:text-gray-400 py-8'>
													Edetabel on tühi
												</p>
											) : (
												leaderboardUsers.map((user, index) => (
													<div
														key={index}
														className='bg-linear-to-r from-blue-50 to-transparent dark:from-gray-700 dark:to-transparent hover:from-blue-100 dark:hover:from-gray-600 p-4 rounded-lg flex justify-between items-center transition-all border border-blue-200 dark:border-gray-600'
													>
														<div className='flex items-center gap-3 flex-1'>
															<span
																className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center ${
																	index === 0
																		? "bg-yellow-400 text-black"
																		: index === 1
																		? "bg-gray-400 text-white"
																		: index === 2
																		? "bg-orange-400 text-white"
																		: "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
																}`}
															>
																{index + 1}
															</span>
															<div>
																<p className='font-semibold text-sm md:text-base'>
																	{user.username}
																</p>
																{user.difficulty && (
																	<p className='text-xs text-gray-500 dark:text-gray-400'>
																		{DIFFICULTY_LEVELS[user.difficulty]?.label}
																	</p>
																)}
															</div>
														</div>
														<div className='text-right'>
															<p className='font-bold text-yellow-600 dark:text-yellow-400 text-sm md:text-base'>
																{user.score}p
															</p>
															{user.completion_time && (
																<p className='text-xs text-gray-500 dark:text-gray-400'>
																	{user.completion_time}s
																</p>
															)}
														</div>
													</div>
												))
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Desktop Leaderboard */}
				<div className='hidden xl:flex justify-end w-1/2 absolute right-10 top-1/2 transform -translate-y-1/2'>
					<div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-96 overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-700'>
						<h2 className='text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2'>
							<FontAwesomeIcon icon={faCrown} className='text-yellow-500' />
							Edetabel
						</h2>

						<hr className='border-gray-300 dark:border-gray-600 my-4' />

						<div className='flex flex-col gap-3'>
							{leaderboardUsers.length === 0 ? (
								<p className='text-center text-gray-500 dark:text-gray-400 py-8'>
									Edetabel on tühi
								</p>
							) : (
								leaderboardUsers.map((user, index) => {
									const difficultyInfo =
										DIFFICULTY_LEVELS[user.difficulty] ||
										DIFFICULTY_LEVELS.easy;

									return (
										<div
											key={index}
											className='bg-linear-to-r from-blue-50 to-transparent dark:from-gray-700 dark:to-transparent hover:from-blue-100 dark:hover:from-gray-600 p-4 rounded-lg flex justify-between items-center transition-all border border-blue-200 dark:border-gray-600'
										>
											<div className='flex items-center gap-3 flex-1'>
												<span
													className={`text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center ${
														index === 0
															? "bg-yellow-400 text-black"
															: index === 1
															? "bg-gray-400 text-white"
															: index === 2
															? "bg-orange-400 text-white"
															: "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
													}`}
												>
													{index + 1}
												</span>
												<div className='flex-1'>
													<p className='font-semibold text-base'>
														{user.username}
													</p>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														{difficultyInfo.label}
													</p>
												</div>
											</div>
											<div className='text-right'>
												<p className='font-bold text-yellow-600 dark:text-yellow-400'>
													{user.score}p
												</p>
												{user.completion_time && (
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														{user.completion_time}s
													</p>
												)}
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
