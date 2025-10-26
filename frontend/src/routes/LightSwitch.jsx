import { useTheme } from "../context/ThemeContext";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const LightSwitch = () => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<div
			className='flex items-center justify-center p-2 rounded-full cursor-pointer bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors'
			onClick={toggleTheme}
		>
			{isDark ? (
				<AiFillMoon className='text-3xl text-gray-200' />
			) : (
				<AiFillSun className='text-3xl text-amber-400' />
			)}
		</div>
	);
};

export default LightSwitch;
