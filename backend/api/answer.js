import express from "express";
import pool from "../utils/db.js";

const router = express.Router();
let IMAGES = [];

// Load images from database on server start to avoid fetching them on every request
(async function loadImages() {
	try {
		const [results] = await pool.query("SELECT * FROM `images`;");
		IMAGES = results;
		console.log(`Loaded ${IMAGES.length} images from database`);
	} catch (error) {
		console.error("Error fetching images:", error);
	}
})();

router.post("/validate-answer", async (req, res) => {
	try {
		const { answer, image } = req.body;

		const foundImage = IMAGES.find((img) => `${img.name}.webp` === image);

		if (!foundImage) {
			return res.status(404).json({ error: "Image not found" });
		}

		const isCorrect = foundImage.answer == answer;

		console.log(
			`Client answered: ${answer}; Correct answer: ${foundImage.answer}`,
			isCorrect
		);

		let nextImage = null;
		if (isCorrect) {
			let filteredImages = IMAGES.filter(
				(img) => `${img.name}.webp` !== image
			);
			nextImage =
				filteredImages[
					Math.floor(Math.random() * filteredImages.length)
				].name + ".webp";
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
			"SELECT username, score FROM `leaderboard` ORDER BY score DESC LIMIT 10"
		);
		res.json(results);
	} catch (error) {
		console.error("Error fetching highscores:", error);
		res.status(500).json({ error: "Database error" });
	}
});

router.post("/submit-score", async (req, res) => {
	try {
		const { username, score } = req.body;

		await pool.query(
			"INSERT INTO `leaderboard` (username, score) VALUES (?, ?)",
			[username, score]
		);

		res.json({ success: true });
	} catch (error) {
		console.error("Error submitting score:", error);
		res.status(500).json({ error: "Database error" });
	}
});

export default router;
