import { AiOutlineInfo } from "react-icons/ai";
import { useNavigate } from "react-router";
import LightSwitch from "./LightSwitch.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Header = () => {
	const navigate = useNavigate();
	const { isLoggedIn, logout } = useAuth();

	return (
		<header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-8 shadow-sm'>
			<div className='flex items-center justify-end space-x-3 w-full'>
				{isLoggedIn && (
					<button
						className='cursor-pointer rounded-full bg-gray-100 dark:bg-gray-700 p-2 px-4 border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm md:text-base font-semibold'
						onClick={() => logout()}
					>
						Logi Välja
					</button>
				)}

				<LightSwitch />

				<button
					onClick={() => navigate("/info")}
					className='p-2 rounded-full cursor-pointer  text-black dark:text-white text-3xl bg-gray-200 dark:bg-inherit dark:hover:bg-gray-700 transition-colors'
					title='Info'
				>
					<AiOutlineInfo />
				</button>
			</div>
		</header>
	);
};

export default Header;
