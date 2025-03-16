import express from "express";

const router = express.Router();

import connection from "../utils/db.js";

const IMAGES = [];

connection.query("SELECT * FROM images", (error, results) => {
    if (error) {
        console.error("Error fetching images:", error);
        return;
    }

    IMAGES.push(...results);
});

router.post("/validate-answer", (req, res) => {
    const { answer, image } = req.body;

    const foundImage = IMAGES.find((img) => `${img.name}.webp` === image);

    console.log(foundImage, answer, image);
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
            filteredImages[Math.floor(Math.random() * filteredImages.length)]
                .name + ".webp";
    }

    const response = {
        isCorrect,
        nextImage,
    };

    res.json(response);
});

router.get("/get-highscores", (req, res) => {
    connection.query(
        "SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10",
        (error, results) => {
            if (error) {
                console.error("Error fetching highscores:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(results);
        }
    );
});

router.post("/submit-score", (req, res) => {
    const { username, score } = req.body;

    connection.query(
        "INSERT INTO leaderboard (username, score) VALUES (?, ?)",
        [username, score],
        (error, results) => {
            if (error) {
                console.error("Error submitting score:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({ success: true });
        }
    );
});

export default router;
