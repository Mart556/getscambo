import { useTheme } from "../context/ThemeContext";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const LightSwitch = () => {
	const { darkMode, setDarkMode } = useTheme();

	const handleChange = () => {
		localStorage.setItem("theme", darkMode ? "dark" : null);
		setDarkMode(!darkMode);
	};

	return (
		<div
			className='flex items-center justify-center p-2 rounded-full cursor-pointer bg-gray-700 dark:hover:bg-gray-700 transition-colors'
			onClick={handleChange}
		>
			{darkMode ? (
				<AiFillMoon className='text-3xl' />
			) : (
				<AiFillSun className='text-3xl text-amber-400' />
			)}
		</div>
	);
};

export default LightSwitch;
