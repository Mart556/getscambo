import { useState, useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router-dom";
import LightSwitch from "./LightSwitch";
import { useTheme } from "../context/ThemeContext";
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
	const { darkMode } = useTheme();
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

		fetch("/api/get-highscores")
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
		<div
			className={`container mx-auto px-8 md:px-10 h-screen flex justify-center items-center overflow-hidden  ${
				darkMode ? "bg-darkBg text-darkText" : "bg-lightBg text-lightText"
			}`}
		>
			<div className='absolute top-4 right-4 flex items-center justify-between  space-x-4'>
				<button
					className='cursor-pointer rounded-full bg-gray-700 dark:bg-gray-800 p-2 px-3 border-2 border-gray-500 text-white hover:bg-gray-600 transition-colors'
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
					className='p-2 rounded-full cursor-pointer bg-gray-700 text-white text-3xl'
				>
					<AiOutlineInfo />
				</a>
			</div>

			<div className='flex flex-col justify-self-center justify-center items-center h-full '>
				<div className='flex flex-col justify-center pt-4'>
					<h1
						className={`text-5xl md:text-6xl font-bold mx-auto rounded-lg px-6 py-8  ${
							darkMode ? "text-neutral-200" : "text-black"
						}`}
					>
						GetScambod{" "}
						<span className='p-4 bg-gray-700 text-neutral-200 border-2 border-gray-500 dark:bg-gray-800 rounded-full italic'>
							V3
						</span>
					</h1>

					<div
						className={`flex justify-center align-center  rounded-4xl backdrop-filter backdrop-blur-lg  max-w-fit mx-auto p-3 px-4 `}
					>
						<p
							className={`${
								darkMode ? "text-white" : "text-black"
							}font-bold text-lg md:text-xl  text-center`}
						>
							Kas scam või mitte scam?
						</p>
					</div>
				</div>

				<div className='flex justify-center my-10'>
					<div className='flex flex-col items-center w-full max-w-md gap-4'>
						{/* Username Input */}
						<input
							type='text'
							className={`border-2 p-3 rounded-lg w-full ${
								darkMode
									? "bg-gray-700 text-white border-gray-600"
									: "bg-gray-100 text-black border-gray-300"
							}`}
							placeholder='Sisesta Kasutajanimi'
							disabled={isLoggedIn}
							value={userName}
							onChange={(event) => setUserName(event.target.value)}
						/>

						{/* Difficulty Selection */}
						<div className='w-full'>
							<p
								className={`text-sm font-semibold mb-2 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
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
												: darkMode
												? "bg-gray-700 text-gray-300 hover:bg-gray-600"
												: "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
							className={`p-4 md:p-6 py-3 md:py-4 rounded-lg w-full cursor-pointer transition-all transform hover:scale-105 ${
								darkMode
									? "bg-green-500 hover:bg-green-600"
									: "bg-green-500 hover:bg-green-600"
							}`}
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
							className='bg-blue-500 hover:bg-blue-600 p-4 md:p-6 py-3 md:py-4 rounded-lg w-full cursor-pointer xl:hidden transition-all'
						>
							<span className='text-xl md:text-2xl font-bold text-white flex items-center justify-center'>
								<FontAwesomeIcon icon={faCrown} className='me-2' />
								Edetabel
							</span>
						</button>

						{/* Mobile Leaderboard Modal */}
						{showLeaderboard && (
							<div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 xl:hidden px-4'>
								<div className='bg-neutral-800/75 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg w-full max-w-lg max-h-96 overflow-y-auto flex flex-col'>
									<div className='flex justify-between items-center mb-4 sticky top-0'>
										<h2 className='text-xl md:text-2xl font-bold text-white'>
											Edetabel
										</h2>
										<button
											onClick={() => setShowLeaderboard(false)}
											className='cursor-pointer text-white hover:text-gray-300'
										>
											<FontAwesomeIcon icon={faTimes} size='lg' />
										</button>
									</div>
									<hr className='border-gray-600 mb-4' />
									<div className='flex flex-col gap-2'>
										{leaderboardUsers.map((user, index) => (
											<div
												key={index}
												className='bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg flex justify-between items-center transition-colors'
											>
												<span className='text-white font-bold text-lg'>
													{index + 1}.
												</span>
												<div className='flex-1 ml-4'>
													<span className='text-white font-semibold'>
														{user.username}
													</span>
													{user.difficulty && (
														<span className='text-gray-400 text-xs ml-2'>
															({DIFFICULTY_LEVELS[user.difficulty]?.label})
														</span>
													)}
												</div>
												<span className='text-yellow-400 font-bold'>
													{user.score} <span className='text-xs'>p</span>
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='hidden xl:flex justify-end w-1/2 absolute right-10 top-1/2 transform -translate-y-1/2'>
					<div className='bg-neutral-800/75 backdrop-filter backdrop-blur-lg p-3 rounded-lg shadow-lg w-1/2 max-w-lg flex flex-col max-h-96 overflow-y-auto'>
						<h2 className='text-xl text-center md:text-2xl font-bold text-white mb-2'>
							Edetabel
						</h2>

						<hr className='text-white my-2' />

						<div className='flex flex-col text-sm'>
							{leaderboardUsers.map((user, index) => {
								const difficultyInfo =
									DIFFICULTY_LEVELS[user.difficulty] || DIFFICULTY_LEVELS.easy;
								return (
									<div
										key={index}
										className='flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0 hover:bg-gray-700/30 px-2 rounded transition-colors'
									>
										<span className='text-white font-bold text-lg w-8'>
											{index + 1}.
										</span>
										<span className='text-white flex-1 ml-2'>
											{user.username}
										</span>
										<span
											className={`px-2 py-1 rounded text-white text-xs font-semibold ${difficultyInfo.color} mr-2`}
										>
											{difficultyInfo.icon}
										</span>
										<span className='text-yellow-400 font-bold w-12 text-right'>
											{user.score}p
										</span>
										<span className='text-gray-300 text-xs w-10 text-right ml-2'>
											{user.completion_time ? `${user.completion_time}s` : "—"}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
