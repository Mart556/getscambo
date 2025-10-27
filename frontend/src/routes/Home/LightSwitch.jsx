import { useTheme } from "../../context/ThemeContext";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const LightSwitch = () => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<div
			className='flex items-center justify-center p-2 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors'
			onClick={toggleTheme}
		>
			{isDark ? (
				<AiFillMoon className='text-3xl text-gray-200' />
			) : (
				<AiFillSun className='text-3xl dark:text-amber-400 text-black' />
			)}
		</div>
	);
};

export default LightSwitch;
