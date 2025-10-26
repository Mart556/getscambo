import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Info = () => {
	const navigate = useNavigate();

	return (
		<div className='container mx-auto px-4 md:px-8 h-screen flex flex-col max-h-screen align-middle justify-center bg-white dark:bg-gray-900 text-black dark:text-white'>
			<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mt-4 flex flex-col justify-center items-center border border-gray-200 dark:border-gray-700'>
				<h1 className='text-4xl md:text-6xl font-bold mb-6'>Info</h1>

				<div className='flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5'>
					<div className='flex flex-col w-full md:w-1/2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg'>
						<h2 className='text-2xl md:text-4xl font-bold mb-2 underline text-center'>
							Kirjeldus
						</h2>

						<p className='text-lg md:text-2xl text-center'>
							Mängu eesmärk on ära arvata millised pildid või küsimused on
							tõesed ja millised mitte. <br />
							<span className='text-yellow-500'>Eeldus</span> on, et oled antud
							teenuse kasutaja ja ootad vastava teemalist kirja.
						</p>
					</div>

					<div className='flex flex-col w-full md:w-1/2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg'>
						<h2 className='text-2xl md:text-4xl font-bold mb-2 underline text-center'>
							Reeglid
						</h2>

						<ul className='text-md md:text-2xl list-disc list-inside'>
							<li>
								Iga õige vastuse eest saad{" "}
								<span className='text-yellow-500'>ühe</span> punkti.
							</li>
							<li>
								Mäng <span className='text-yellow-500'>lõppeb</span> , kui
								vastad valesti või aeg saab otsa.
							</li>
							<li>
								Aega on täpselt <span className='text-yellow-500'>üks</span>{" "}
								minut.
							</li>
						</ul>
					</div>
				</div>

				<p className='text-lg md:text-2xl mt-4 font-bold'>Edu mängimisel!</p>

				<button
					className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 w-50 rounded m-3 text-2xl cursor-pointer transition-colors'
					onClick={() => navigate("/")}
				>
					<FontAwesomeIcon icon={faHome} size='lg' className='me-2' />
					Tagasi
				</button>
			</div>
		</div>
	);
};

export default Info;
