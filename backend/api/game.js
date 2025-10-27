import { Router } from "express";
import pool from "../utils/db.js";

const router = Router();

router.post("/start-game", (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const { difficulty } = req.body;
	if (!["easy", "medium", "hard"].includes(difficulty)) {
		return res.status(400).json({ error: "Invalid difficulty level" });
	}

	const userId = req.user.id;

	req.session.game = {
		userId,
		difficulty,
		startTime: Date.now(),
		score: 0,
	};

	console.log(
		`User ${req.user.username} started a new game with difficulty: ${difficulty}`
	);

	res.status(200).json({ message: "Game started" });
});

router.post("/end-game", async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const userId = req.user.id;
	const gameSession = req.session.game;

	if (!gameSession || gameSession.userId !== userId) {
		return res.status(400).json({ error: "Invalid game session" });
	}

	gameSession.endTime = Date.now();

	let completionTime = null;
	if (gameSession.startTime) {
		completionTime = (gameSession.endTime - gameSession.startTime) / 1000;
	}

	console.log(
		`User ${req.user.username} finished game. Score: ${gameSession.score}, Time: ${completionTime}s, Difficulty: ${gameSession.difficulty}`
	);

	let didBeatPersonalBest = false;

	try {
		const [allScores] = await pool.query(
			"SELECT MAX(score) as highestScore FROM `leaderboard` WHERE username = ?",
			[req.user.username]
		);

		const playerHighestScore = allScores[0]?.highestScore || 0;

		if (gameSession.score > playerHighestScore) {
			await pool.query(
				"INSERT INTO `leaderboard` (username, score, difficulty, completion_time) VALUES (?, ?, ?, ?)",
				[
					req.user.username,
					gameSession.score,
					gameSession.difficulty,
					Math.round(completionTime),
				]
			);
			console.log(
				`User ${req.user.username} achieved a new personal best! Score: ${gameSession.score}`
			);
		} else if (gameSession.score === playerHighestScore) {
			const [existingRecords] = await pool.query(
				"SELECT * FROM `leaderboard` WHERE username = ? AND score = ? ORDER BY completion_time ASC",
				[req.user.username, gameSession.score]
			);

			if (existingRecords.length > 0) {
				const bestTime = existingRecords[0].completion_time;
				if (completionTime < bestTime) {
					await pool.query(
						"INSERT INTO `leaderboard` (username, score, difficulty, completion_time) VALUES (?, ?, ?, ?)",
						[
							req.user.username,
							gameSession.score,
							gameSession.difficulty,
							Math.round(completionTime),
						]
					);
					console.log(
						`User ${req.user.username} improved their time! Score: ${
							gameSession.score
						}, New time: ${Math.round(completionTime)}s`
					);
				}
			}
		}

		res.status(200).json({ didBeatPersonalBest });
	} catch (error) {
		console.error("Error processing end-game:", error);
		res.status(500).json({ error: "Database error" });
	}
});

export default router;
