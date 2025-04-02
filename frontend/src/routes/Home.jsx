import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LightSwitch from "./LightSwitch";
import { ThemeProvider, useTheme } from "./ThemeContext";

const GitAPI = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlay,
	faCircleInfo,
	faCrown,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
	const { darkMode } = useTheme(); // Access darkMode from ThemeContext
	const [userName, setUserName] = useState(
		localStorage.getItem("username") || ""
	);

	useEffect(() => {
		localStorage.setItem("username", userName);
	}, [userName]);

	const [leaderboardUsers, setLeaderboardUsers] = useState([]);
	const [gitStars, setGitStars] = useState(0);

	useEffect(() => {
		localStorage.setItem(
			"lastHighScore",
			localStorage.getItem("highestPoints") || 0
		);

		fetch("https://api.github.com/repos/Mart556/getscambo", {
			headers: {
				Authorization: `token ${GitAPI}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log("GitHub repo data fetched:", data);
				setGitStars(data.stargazers_count || 0);
			})
			.catch((error) => {
				console.error("Error fetching GitHub repo data:", error);
			});

		fetch("/api/get-highscores")
			.then((response) => response.json())
			.then((data) => {
				console.log("Highscores fetched:", data);
				const leaderboardUsers = data.map((user) => ({
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

	const handleStartGame = () => {
		console.log("Starting the game with username:", userName);
		if (userName.length > 3 && !userName.includes(" ")) {
			localStorage.setItem("username", userName);
			navigate("/start");
			return;
		} else {
			alert(
				"Sisesta kasutajanimi ja proovi uuesti! \nKasutajanimi peab olema vähemalt 4 tähemärki pikk ja ei tohi sisaldada tühikuid."
			);
		}
	};

	const handleInfoPage = () => {
		navigate("/info");
	};

	return (
		<div
			className={`container mx-auto px-8 md:px-10 h-screen flex justify-center items-center overflow-hidden ${
				darkMode
					? "bg-darkBg text-darkText"
					: "bg-lightBg text-lightText"
			}`}
		>
			<div className='absolute bottom-4 right-4 flex'>
				<button
					type='button'
					href='#'
					onClick={() => {
						window.open("https://github.com/Mart556/getscambo");
					}}
					className='flex overflow-hidden items-center text-sm font-medium  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2'
				>
					<span className='absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-black opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40'></span>
					<div className='flex items-center'>
						<svg
							className='w-4 h-4 fill-current'
							viewBox='0 0 438.549 438.549'
						>
							<path d='M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z'></path>
						</svg>
						<span className='ml-1 text-white'>Star on GitHub</span>
					</div>
					<div className='ml-2 flex items-center gap-1 text-sm md:flex'>
						<svg
							className='w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300'
							data-slot='icon'
							aria-hidden='true'
							fill='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								clipRule='evenodd'
								d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
								fillRule='evenodd'
							></path>
						</svg>
						<span className='inline-block tabular-nums tracking-wider font-display font-medium text-white'>
							{gitStars}
						</span>
					</div>
				</button>
			</div>

			<div className='absolute top-4 right-4'>
				<LightSwitch />
				<a href='#' rel='noopener noreferrer' onClick={handleInfoPage}>
					<FontAwesomeIcon
						icon={faCircleInfo}
						className={
							darkMode
								? "text-white text-3xl"
								: "text-black text-3xl"
						}
					/>
				</a>
			</div>

			<div className='flex flex-col justify-self-center justify-center items-center h-full '>
				<div className='flex flex-col justify-center pt-4'>
					<h1
						className={`text-5xl md:text-6xl font-bold mx-auto rounded-lg px-6 py-8  ${
							darkMode ? "text-neutral-200" : "text-black"
						}`}
					>
						GetScambod v2
					</h1>

					<div className='flex justify-center mt-4'>
						<div className='border-l-2 border-gray-600 h-15'></div>
					</div>

					<div
						className={`flex justify-center align-center mt-4 rounded-4xl backdrop-filter backdrop-blur-lg  max-w-fit mx-auto p-3 px-4 `}
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
					<div className='flex flex-col items-center w-full max-w-md'>
						<input
							type='text'
							className={`border-2 p-2 rounded-lg ${
								darkMode
									? "bg-darkBg text-darkText"
									: "bg-lightBg text-lightText"
							}`}
							placeholder='Sisesta Kasutajanimi'
							value={userName}
							onChange={(event) =>
								setUserName(event.target.value)
							}
						/>

						<button
							type='button'
							onClick={() => handleStartGame()}
							className={`p-4 md:p-8 py-3 md:py-4 rounded-lg z-4 mt-4 w-full cursor-pointer ${
								darkMode
									? "bg-green-500 text-white"
									: "bg-green-500 text-black"
							}`}
						>
							<span className='text-xl md:text-2xl font-bold text-white flex items-center justify-center'>
								<FontAwesomeIcon
									icon={faPlay}
									className='me-2'
								/>
								Mängima
							</span>
						</button>

						<button
							type='button'
							onClick={() => setShowLeaderboard(true)}
							className='bg-blue-500 p-4 md:p-8 py-3 md:py-4 rounded-lg z-4 mt-2 w-full cursor-pointer xl:hidden'
						>
							<span className='text-xl md:text-2xl font-bold text-white flex items-center justify-center'>
								<FontAwesomeIcon
									icon={faCrown}
									className='me-2'
								/>
								Edetabel
							</span>
						</button>

						{showLeaderboard && (
							<div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-3 xl:hidden px-8'>
								<div className='bg-neutral-800/75 backdrop-filter backdrop-blur-lg p-3 rounded-lg shadow-lg w-full max-w-lg flex flex-col'>
									<div className='flex justify-between items-center'>
										<h2 className='text-xl text-center md:text-2xl  font-bold text-white'>
											Edetabel
										</h2>
										<div
											onClick={() =>
												setShowLeaderboard(false)
											}
											className='cursor-pointer'
										>
											<FontAwesomeIcon
												icon={faTimes}
												size='xl'
												className='text-white '
											/>
										</div>
									</div>
									<hr className='text-white my-2' />
									<div className='flex flex-col'>
										{leaderboardUsers.map((user, index) => (
											<div
												key={index}
												className='flex justify-between items-center py-2 font-bold'
											>
												<span className='text-white text-lg'>
													{index + 1}.
												</span>
												<span className='text-white'>
													{user.username}
												</span>
												<span className='text-white'>
													{user.score}{" "}
													<span className='text-xs'>
														p
													</span>
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
					<div className='bg-neutral-800/75  backdrop-filter backdrop-blur-lg  p-3 rounded-lg shadow-lg w-1/2 max-w-lg flex flex-col'>
						<h2 className='text-xl text-center md:text-2xl font-bold text-white'>
							Edetabel
						</h2>

						<hr className='text-white my-2' />

						<div className='flex flex-col'>
							{leaderboardUsers.map((user, index) => (
								<div
									key={index}
									className='flex justify-between items-center py-2  font-bold'
								>
									<span className='text-white text-lg'>
										{index + 1}.
									</span>
									<span className='text-white'>
										{user.username}
									</span>
									<span className='text-white'>
										{user.score}{" "}
										<span className='text-xs'>p</span>
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
