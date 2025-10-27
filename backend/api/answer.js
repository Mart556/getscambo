import express from "express";
import pool from "../utils/db.js";

const router = express.Router();
let IMAGES = [];

(async function loadImages() {
	try {
		const [results] = await pool.query("SELECT * FROM `images`;");
		IMAGES = results;
	} catch (error) {
		console.error("Error fetching images:", error);
	}
})();

router.post("/validate-answer", async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const gameSession = req.session.game;
	if (!gameSession) {
		return res.status(400).json({ error: "No active game session" });
	}

	try {
		const { answer, image } = req.body;

		let foundImage = IMAGES.find((img) => `${img.name}.webp` === image);

		if (!foundImage) {
			return res.status(404).json({ error: "Image not found" });
		}

		const isCorrect = foundImage.answer == answer;

		let nextImage = null;
		if (isCorrect) {
			let filteredImages = IMAGES.filter((img) => `${img.name}.webp` !== image);
			nextImage =
				filteredImages[Math.floor(Math.random() * filteredImages.length)].name +
				".webp";
		}

		gameSession.score += isCorrect ? 1 : 0;

		console.log(
			`User ${req.user.username} answered ${
				isCorrect ? "correctly" : "incorrectly"
			}. New score: ${gameSession.score}`
		);

		res.json({
			isCorrect,
			nextImage,
		});
	} catch (error) {
		console.error("Error validating answer:", error);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/get-highscores", async (req, res) => {
	try {
		const [results] = await pool.query(
			`SELECT username, score, difficulty, completion_time FROM \`leaderboard\` 
			ORDER BY 
				score DESC,
				CASE 
					WHEN difficulty = 'hard' THEN 3
					WHEN difficulty = 'medium' THEN 2
					WHEN difficulty = 'easy' THEN 1
					ELSE 0
				END DESC,
				completion_time ASC
			LIMIT 10`
		);
		res.json(results);
	} catch (error) {
		console.error("Error fetching highscores:", error);
		res.status(500).json({ error: "Database error" });
	}
});



export default router;
