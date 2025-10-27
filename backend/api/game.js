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
		`User ${req.user.username} finished game. Score: ${gameSession.score}, Time: ${completionTime}s`
	);

	await pool.query(
		"INSERT INTO `leaderboard` (username, score, difficulty, completion_time) VALUES (?, ?, ?, ?)",
		[
			req.user.username,
			gameSession.score,
			gameSession.difficulty,
			Math.round(completionTime),
		]
	);

	res.status(200).json({ message: "Game ended" });
});

export default router;
