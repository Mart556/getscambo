import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cookieParser());

app.use(
	cors({
		origin: process.env.ENV === "development" ? "http://localhost:5173" : "*",
		credentials: true,
		allowedHeaders: ["Content-Type"],
		exposedHeaders: ["Set-Cookie"],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: true,
			sameSite: "lax",
			maxAge: 60000 * 60,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

import answerRouter from "./api/answer.js";
app.use("/api", answerRouter);

import authRouter from "./api/auth.js";
app.use("/api/auth", authRouter);

app.use(express.static("frontend/dist"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
