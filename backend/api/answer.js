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
			"SELECT username, score, difficulty, completion_time FROM `leaderboard` ORDER BY score DESC LIMIT 10"
		);
		res.json(results);
	} catch (error) {
		console.error("Error fetching highscores:", error);
		res.status(500).json({ error: "Database error" });
	}
});

router.post("/submit-score", async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const { score, difficulty, completion_time } = req.body;
		await pool.query(
			"INSERT INTO `leaderboard` (username, score, difficulty, completion_time) VALUES (?, ?, ?, ?)",
			[
				req.user.username,
				score,
				difficulty || "medium",
				completion_time || null,
			]
		);

		res.sendStatus(201);
	} catch (error) {
		console.error("Error submitting score:", error);
		res.status(500).json({ error: "Database error" });
	}
});


export default router;
