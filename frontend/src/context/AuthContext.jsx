import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	console.log("AuthProvider render - isLoggedIn:", isLoggedIn, "user:", user);

	/* 	useEffect(() => {
		fetch("/api/auth/user", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Fetched user:", data);
				if (data && data.id && data.username) {
					setUser(data);
					setIsLoggedIn(true);
				} else {
					setUser(null);
					setIsLoggedIn(false);
				}
			})
			.catch((err) => {
				console.error("Error fetching user:", err);
				setUser(null);
				setIsLoggedIn(false);
			});
	}, []);
 */
	const logout = () => {
		fetch("/api/auth/logout", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
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
