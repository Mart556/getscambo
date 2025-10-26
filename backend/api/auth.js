import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "../utils/db.js";
import bcrypt from "bcrypt";

const router = Router();

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
	console.log("Deserializing user with ID:", id);
	try {
		const [results] = await pool.query(
			"SELECT id, username FROM users WHERE id = ?",
			[id]
		);

		if (results && results.length > 0) {
			return cb(null, results[0]);
		}
		return cb(null, null);
	} catch (err) {
		console.error("Error deserializing user:", err);
		return cb(err);
	}
});

passport.use(
	"local",
	new LocalStrategy(async (username, password, cb) => {
		try {
			const [users] = await pool.query(
				"SELECT id, username, password FROM users WHERE username = ?",
				[username]
			);

			if (users.length === 0) {
				return cb(null, false, { message: "User not found." });
			}

			const user = users[0];
			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return cb(null, false, { message: "Incorrect password." });
			}

			const userData = { id: user.id, username: user.username };

			return cb(null, userData);
		} catch (error) {
			return cb(error);
		}
	})
);

router.post("/register", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required." });
	}

	try {
		const [users] = await pool.query(
			"SELECT id FROM users WHERE username = ?",
			[username],
			(err) => {
				if (err) {
					return res.status(500).json({ message: "Database error." });
				}
			}
		);

		if (users.length > 0) {
			return res.status(409).json({ message: "Username already exists." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const [{ userId }] = await pool.query(
			"INSERT INTO users (username, password) VALUES (?, ?)",
			[username, hashedPassword],
			(err) => {
				if (err) {
					return res.status(500).json({ message: "Database error." });
				}
			}
		);

		if (userId) {
			return res.status(201).json({ message: "Registration successful." });
		} else {
			return res.status(500).json({ message: "Registration failed." });
		}
	} catch (error) {
		console.error("Registration error:", error);
		return res.status(500).json({ message: "Registration failed." });
	}
});

router.post("/login", passport.authenticate("local"), (req, res) => {
	console.log("=== LOGIN ===");
	console.log("Session ID:", req.sessionID);
	console.log("User:", req.user);
	console.log("=== END === \n");

	res.status(200).json({
		message: "Login successful.",
		user: req.user,
	});
});

router.post("/logout", (req, res, next) => {
	console.log("=== LOGOUT ===");
	console.log("Session ID:", req.sessionID);
	console.log("User:", req.user, req.isAuthenticated());
	console.log("=== END === \n");

	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	req.logout((err) => {
		if (err) return next(err);
		return res
			.status(200)
			.json({ ok: true, message: "Logged out successfully." });
	});
});

router.get("/user", (req, res) => {
	console.log("/user endpoint - isAuthenticated:", req.isAuthenticated());
	console.log("Session ID:", req.sessionID);
	console.log("User:", req.user);

	if (req.isAuthenticated()) {
		return res.json(req.user);
	}

	return res.status(401).json({ message: "Not authenticated." });
});

export default router;
