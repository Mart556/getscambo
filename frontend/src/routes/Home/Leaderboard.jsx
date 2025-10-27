import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import DIFFICULTY_LEVELS from "../../assets/difficulties.json";

const Leaderboard = ({
	isDesktop = false,
	onClose = null,
	showLeaderboard = false,
}) => {
	if (!isDesktop && !showLeaderboard) return null;

	const [users, setUsers] = useState([]);

	useEffect(() => {
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
					difficulty: user.difficulty,
					completion_time: user.completion_time,
				}));

				setUsers(leaderboardUsers);
			})
			.catch((error) => {
				console.error("Error fetching highscores:", error);
			});
	}, []);

	const getRankColor = (rank) => {
		if (rank === 0) return "bg-yellow-400 text-black";
		if (rank === 1) return "bg-gray-400 text-white";
		if (rank === 2) return "bg-orange-400 text-white";
		return "bg-gray-300 dark:bg-gray-600 text-black dark:text-white";
	};

	if (isDesktop) {
		return (
			<div className='flex-col flex bg-white min-h-full dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 '>
				<div className='flex items-center justify-center gap-2 mb-4'>
					<FontAwesomeIcon
						icon={faCrown}
						className='text-yellow-500 text-2xl'
					/>
					<h2 className='text-2xl font-bold'>Edetabel</h2>
				</div>

				<hr className='border-gray-300 dark:border-gray-600 mb-4' />

				<div className='flex flex-col items-center gap-3 max-h-60 overflow-y-auto'>
					{users.length === 0 ? (
						<p className=' text-gray-500 dark:text-gray-400'>Midagi pole 😪</p>
					) : (
						users.map((user, index) => {
							const difficultyInfo =
								DIFFICULTY_LEVELS[user.difficulty] || DIFFICULTY_LEVELS.easy;

							return (
								<div
									key={index}
									className='bg-linear-to-r from-blue-50 to-transparent  dark:from-gray-700 dark:to-transparent hover:from-blue-100 dark:hover:from-gray-600 p-4 rounded-lg grid grid-cols-12 gap-3 items-center transition-all border border-blue-200 dark:border-gray-600'
								>
									<div className='col-span-2'>
										<span
											className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getRankColor(
												index
											)}`}
										>
											{index + 1}
										</span>
									</div>
									<div className='col-span-5 min-w-0'>
										<p className='font-semibold text-sm truncate'>
											{user.username}
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400'>
											Tase: {difficultyInfo.label}
										</p>
									</div>
									<div className='col-span-3 text-right'>
										<p className='font-bold text-yellow-600 dark:text-yellow-400 text-sm'>
											{user.score}p
										</p>
									</div>
									<div className='col-span-2 text-right'>
										{user.completion_time ? (
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												{user.completion_time}s
											</p>
										) : (
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												—
											</p>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		);
	}

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 lg:hidden px-4 py-8'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-96 overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-700'>
				<div className='flex justify-between items-center mb-6'>
					<div className='flex items-center gap-2'>
						<FontAwesomeIcon
							icon={faCrown}
							className='text-yellow-500 text-2xl'
						/>
						<h2 className='text-2xl font-bold'>Edetabel</h2>
					</div>
					<button
						onClick={onClose}
						className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-2xl'
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<hr className='border-gray-300 dark:border-gray-600 mb-4' />

				<div className='flex flex-col gap-3'>
					{users.length === 0 ? (
						<p className='text-center text-gray-500 dark:text-gray-400 py-8'>
							Edetabel on tühi
						</p>
					) : (
						users.map((user, index) => {
							const difficultyInfo =
								DIFFICULTY_LEVELS[user.difficulty] || DIFFICULTY_LEVELS.easy;

							return (
								<div
									key={index}
									className='bg-linear-to-r from-blue-50 to-transparent dark:from-gray-700 dark:to-transparent hover:from-blue-100 dark:hover:from-gray-600 p-4 rounded-lg flex justify-between items-center transition-all border border-blue-200 dark:border-gray-600'
								>
									<div className='flex items-center gap-3 flex-1'>
										<span
											className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getRankColor(
												index
											)}`}
										>
											{index + 1}
										</span>
										<div>
											<p className='font-semibold text-sm md:text-base'>
												{user.username}
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												{difficultyInfo.label}
											</p>
										</div>
									</div>
									<div className='text-right shrink-0 ml-2'>
										<p className='font-bold text-yellow-600 dark:text-yellow-400 text-sm md:text-base'>
											{user.score}p
										</p>
										{user.completion_time ? (
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												{user.completion_time}s
											</p>
										) : (
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												—
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
	);
};

export default Leaderboard;
