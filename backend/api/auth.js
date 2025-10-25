import { Router } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import pool from "../utils/db.js";
import bcrypt from "bcrypt";

const router = Router();

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	pool.query(
		"SELECT id, username FROM users WHERE id = ?",
		[id],
		(err, results) => {
			if (err) {
				return done(err);
			}
			done(null, results[0]);
		}
	);
});

passport.use(
	"local",
	new Strategy(async (username, password, done) => {
		try {
			const [users] = await pool.query(
				"SELECT id, username, password FROM users WHERE username = ?",
				[username]
			);

			if (users.length === 0) {
				return done(null, false, { message: "User not found." });
			}

			const user = users[0];
			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return done(null, false, { message: "Incorrect password." });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
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
	return res.status(200).json({
		message: "Login successful.",
		user: { id: req.user.id, username: req.user.username },
	});
});

router.post("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		return res
			.status(200)
			.json({ ok: true, message: "Logged out successfully." });
	});
});

router.get("/user", (req, res) => {
	if (req.isAuthenticated()) {
		return res.json(req.user);
	}

	return res.status(401).json({ message: "Not authenticated." });
});

export default router;
