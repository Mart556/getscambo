import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const ErrorPage = () => {
    return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white'>
				<h1 className='text-8xl font-bold text-red-500'>404</h1>
				<p className='mt-4 text-xl'>Korraldasid mingi jama...</p>

				<button
					type='button'
					className='mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors'
					onClick={() => window.location.replace("/")}
				>
					<FontAwesomeIcon icon={faHome} size='lg' className='me-2' />
					Tagasi
				</button>
			</div>
		);
};

export default ErrorPage;
