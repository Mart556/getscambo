import express from "express";

const router = express.Router();

import connection from "../db.js";

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

export default router;
