import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router";

const ErrorPage = () => {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white'>
			<h1 className='text-8xl font-bold text-red-500'>404</h1>
			<p className='mt-4 text-xl'>Korraldasid mingi jama...</p>

			<button
				type='button'
				className='mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors flex items-center'
				onClick={() => navigate("/")}
			>
				<FaHome className='me-2 text-2xl' />
				Tagasi
			</button>
		</div>
	);
};

export default ErrorPage;
