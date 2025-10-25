import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		fetch("http://localhost:3000/api/auth/user", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Fetched user:", data);
				if (data.user) {
					setUser(data.user);
					setIsLoggedIn(true);
				}
			})
			.catch((err) => {
				console.error("Error fetching user:", err);
			});
	}, []);

	const logout = () => {
		fetch("http://localhost:3000/api/auth/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				if (res.ok) {
					setUser(null);
					setIsLoggedIn(false);
					localStorage.removeItem("username");

					alert("Olete edukalt välja logitud.");
				}
			})
			.catch((err) => {
				console.error("Error logging out:", err);
			});
	};

	return (
		<AuthContext.Provider
			value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
