import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Create the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
import answerRouter from "./api/answer.js";
app.use("/api", answerRouter);

import cronJobs from "./utils/cron_jobs.js";
cronJobs();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// This catch-all route should come AFTER all API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
