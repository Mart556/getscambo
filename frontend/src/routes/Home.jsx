import { useState, useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router";
import LightSwitch from "./LightSwitch";
import { useGame } from "../context/GameContext.jsx";

const GitAPI = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";

import { AiOutlineInfo } from "react-icons/ai";
import { IoLogInOutline } from "react-icons/io5";
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
		<div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white'>
			{/* Header */}
			<header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-8 shadow-sm'>
				<div className='container mx-auto flex justify-between items-center'>
					<div className='flex-1'></div>
					<div className='flex items-center justify-center space-x-3'>
						<button
							className='cursor-pointer rounded-full bg-gray-100 dark:bg-gray-700 p-2 px-4 border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm md:text-base font-semibold'
							onClick={() => (isLoggedIn ? logout() : navigate("/auth"))}
						>
							{isLoggedIn ? "Logi Välja" : "Registreeru/Logi Sisse"}
						</button>
						<LightSwitch />
						<button
							onClick={() => navigate("/info")}
							className='p-2 rounded-full cursor-pointer bg-gray-100 dark:bg-gray-700 text-black dark:text-white text-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
							title='Info'
						>
							<AiOutlineInfo />
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-1 flex items-center justify-center px-4 md:px-8 py-8'>
				<div className='w-full max-w-7xl'>
					{/* Hero Section */}
					<div className='text-center mb-12'>
						<h1 className='text-5xl md:text-7xl font-bold mb-4'>
							GetScambod{" "}
							<span className='inline-block px-4 py-2 md:px-6 md:py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full text-3xl md:text-4xl ml-2 md:ml-4 font-italic border-2 border-blue-400'>
								V3
							</span>
						</h1>
						<p className='text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-semibold'>
							🕵️ Kas scam või mitte scam? 🕵️
						</p>
					</div>

					{/* Main Grid */}
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						{/* Left Side - Game Controls */}
						<div className='lg:col-span-2'>
							{isLoggedIn ? (
								<div className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
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

									{/* Start Game Button */}
									<button
										type='button'
										onClick={() => startGame(selectedDifficulty)}
										disabled={!isLoggedIn}
										className='w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 md:py-5 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg md:text-xl shadow-lg'
									>
										<FontAwesomeIcon icon={faPlay} className='me-3' />
										Mängima
									</button>

									{/* Mobile Leaderboard Button */}
									<button
										type='button'
										onClick={() => setShowLeaderboard(true)}
										className='w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 rounded-lg lg:hidden transition-all text-base md:text-lg'
									>
										<FontAwesomeIcon icon={faCrown} className='me-2' />
										Vaata Edetabelit
									</button>
								</div>
							) : (
								<div className='bg-linear-to-br bg-white dark:from-gray-800 dark:to-gray-700 p-8 md:p-12 rounded-xl shadow-lg border-2 border-dashed border-blue-300 dark:border-gray-600 text-center'>
									<p className='text-xl md:text-2xl font-bold mb-6'>
										Logi sisse, et mängida!
									</p>
									<button
										onClick={() => navigate("/auth")}
										className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105'
									>
										<IoLogInOutline className='inline-block mr-2 text-2xl' />
										Registreeru või Logi Sisse
									</button>
								</div>
							)}
						</div>

						{/* Right Side - Desktop Leaderboard */}
						<div className='hidden lg:block'>
							<div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24'>
								<div className='flex items-center justify-center gap-2 mb-6'>
									<FontAwesomeIcon
										icon={faCrown}
										className='text-yellow-500 text-2xl'
									/>
									<h2 className='text-2xl font-bold'>Edetabel</h2>
								</div>
								<hr className='border-gray-300 dark:border-gray-600 mb-4' />

								<div className='flex flex-col gap-3 max-h-96 overflow-y-auto'>
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
													<div className='flex items-center gap-3 flex-1 min-w-0'>
														<span
															className={`text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
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
														<div className='min-w-0'>
															<p className='font-semibold text-sm truncate'>
																{user.username}
															</p>
															<p className='text-xs text-gray-500 dark:text-gray-400'>
																{difficultyInfo.label}
															</p>
														</div>
													</div>
													<div className='text-right shrink-0 ml-2'>
														<p className='font-bold text-yellow-600 dark:text-yellow-400 text-sm'>
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
			</main>

			{/* Mobile Leaderboard Modal */}
			{showLeaderboard && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 lg:hidden px-4 py-8'>
					<div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-96 overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-700'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-2xl md:text-3xl font-bold flex items-center gap-2'>
								<FontAwesomeIcon icon={faCrown} className='text-yellow-500' />
								Edetabel
							</h2>
							<button
								onClick={() => setShowLeaderboard(false)}
								className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-2xl'
							>
								<FontAwesomeIcon icon={faTimes} />
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
	);
};

export default Home;
