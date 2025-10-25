import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false, maxAge: 60000 * 60 },
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

import answerRouter from "./api/answer.js";
app.use("/api", answerRouter);

import authRouter from "./api/auth.js";
app.use("/api/auth", authRouter);

import cronJobs from "./utils/cron_jobs.js";
cronJobs();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
