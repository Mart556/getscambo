import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Auth = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isRegister, setIsRegister] = useState(false);
	const navigate = useNavigate();
	const { setUser, setIsLoggedIn } = useAuth();

	const validateInput = () => {
		setError(null);
		setSuccess(null);

		if (!username.trim()) {
			setError("Kasutajanimi on nõutav.");
			return false;
		}

		if (!password) {
			setError("Parool on nõutav.");
			return false;
		}

		if (password.length < 6) {
			setError("Parool peab olema vähemalt 6 tähemärki pikk.");
			return false;
		}

		if (isRegister && password !== confirmPassword) {
			setError("Paroolid ei ühtivad.");
			return false;
		}

		return true;
	};

	const handleRegister = async (e) => {
		e.preventDefault();

		if (!validateInput()) return;

		setIsLoading(true);

		try {
			const response = await fetch("http://localhost:3000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password, confirmPassword }),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess("Registreerimine oli edukas! Logi nüüd sisse.");
				setUsername("");
				setPassword("");
				setConfirmPassword("");
				setIsRegister(false);
			} else {
				setError(data.message || "Registreerimine ebaõnnestus.");
			}
		} catch (err) {
			console.error("Error:", err);
			setError("Registreerimine ebaõnnestus.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		if (!validateInput()) return;

		setIsLoading(true);

		try {
			const response = await fetch("http://localhost:3000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			console.log("Login response data:", data);
			if (response.ok && data.message === "Login successful.") {
				setSuccess(`Tere tulemast tagasi, ${data.user.username}!`);
				localStorage.setItem("username", data.user.username);
				setTimeout(() => {
					setUser(data.user);
					setIsLoggedIn(true);
					console.log(
						"User logged in:",
						data.user.username,
						data.user.id,
						document.cookie
					);
					navigate("/");
				}, 1000);
			} else {
				setError(data.message || "Sisselogimine ebaõnnestus.");
			}
		} catch (err) {
			console.error("Error:", err);
			setError("Sisselogimine ebaõnnestus.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 py-8'>
			<div className='bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700'>
				{/* Header with Close Button */}
				<div className='flex flex-row justify-between items-center mb-6'>
					<h1 className='text-2xl md:text-3xl font-bold text-black dark:text-white'>
						{isRegister ? "Registreeru" : "Logi Sisse"}
					</h1>

					<button
						className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors'
						onClick={() => navigate("/")}
						aria-label='Close'
					>
						<FontAwesomeIcon icon={faXmark} className='text-2xl' />
					</button>
				</div>

				{/* Error Message */}
				{error && (
					<div className='bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4'>
						{error}
					</div>
				)}

				{/* Success Message */}
				{success && (
					<div className='bg-green-100 dark:bg-green-500/20 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4'>
						{success}
					</div>
				)}

				{/* Form */}
				<form
					className='space-y-4'
					onSubmit={isRegister ? handleRegister : handleLogin}
				>
					{/* Username Field */}
					<div>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2 font-semibold'
							htmlFor='username'
						>
							Kasutajanimi
						</label>
						<input
							className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all'
							type='text'
							id='username'
							placeholder='Sisesta oma kasutajanimi'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={isLoading}
						/>
					</div>

					{/* Password Field */}
					<div>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2 font-semibold'
							htmlFor='password'
						>
							Parool
						</label>
						<div className='relative'>
							<input
								className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-10'
								type={showPassword ? "text" : "password"}
								id='password'
								placeholder='Sisesta oma parool'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
							/>
							<button
								type='button'
								className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors'
								onClick={() => setShowPassword(!showPassword)}
								disabled={isLoading}
							>
								<FontAwesomeIcon
									icon={showPassword ? faEyeSlash : faEye}
									className='text-lg'
								/>
							</button>
						</div>
					</div>

					{/* Confirm Password Field (Register Only) */}
					{isRegister && (
						<div>
							<label
								className='block text-gray-700 dark:text-gray-300 mb-2 font-semibold'
								htmlFor='confirmPassword'
							>
								Kinnita Parool
							</label>
							<div className='relative'>
								<input
									className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-10'
									type={showConfirmPassword ? "text" : "password"}
									id='confirmPassword'
									placeholder='Kinnita oma parool'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									disabled={isLoading}
								/>
								<button
									type='button'
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									disabled={isLoading}
								>
									<FontAwesomeIcon
										icon={showConfirmPassword ? faEyeSlash : faEye}
										className='text-lg'
									/>
								</button>
							</div>
						</div>
					)}

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
						disabled={isLoading}
					>
						{isLoading
							? isRegister
								? "Registreerimine..."
								: "Sisselogimine..."
							: isRegister
							? "Registreeru"
							: "Logi Sisse"}
					</button>
				</form>

				{/* Toggle between Login and Register */}
				<div className='mt-6 text-center'>
					<p className='text-gray-600 dark:text-gray-400'>
						{isRegister ? "Juba konto olemas? " : "Konto pole? "}
						<button
							type='button'
							className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors'
							onClick={() => {
								setIsRegister(!isRegister);
								setError(null);
								setSuccess(null);
								setUsername("");
								setPassword("");
								setConfirmPassword("");
							}}
							disabled={isLoading}
						>
							{isRegister ? "Logi Sisse" : "Registreeru"}
						</button>
					</p>
				</div>

				{/* Back to Home Link */}
				<div className='mt-4 text-center'>
					<button
						type='button'
						className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm transition-colors'
						onClick={() => navigate("/")}
					>
						← Tagasi Avaleht
					</button>
				</div>
			</div>
		</div>
	);
};

export default Auth;
