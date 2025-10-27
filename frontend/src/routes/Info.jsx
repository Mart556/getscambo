import { useNavigate } from "react-router";
import { MdDescription, MdRule } from "react-icons/md";
import { FaHome } from "react-icons/fa";

const Info = () => {
	const navigate = useNavigate();

	return (
		<div className='container flex-col flex justify-center mx-auto px-4 md:px-8 min-h-screen py-8  dark:bg-gray-900 text-black dark:text-white'>
			<div className='mb-12 text-center'>
				<h1 className='text-5xl md:text-6xl font-bold mb-2'>Info</h1>
				<div className='h-1 w-20 bg-blue-500 mx-auto rounded-full'></div>
				<p className='text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 mt-2'>
					Versioon: 3.0
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto'>
				<div className=' dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow'>
					<div className='flex items-center gap-3 mb-4'>
						<MdDescription className='text-3xl text-blue-500' />
						<h2 className='text-2xl md:text-3xl font-bold'>Kirjeldus</h2>
					</div>
					<hr className='border-gray-300 dark:border-gray-600 mb-4' />
					<p className='text-base md:text-lg leading-relaxed'>
						Mängu eesmärk on ära arvata millised pildid või küsimused on
						<span className='font-semibold'> tõesed</span> ja millised{" "}
						<span className='font-semibold text-red-500'>mitte</span>. <br />
						<br />
						<span className='text-yellow-500 font-semibold'>Eeldus</span> on, et
						oled antud teenuse kasutaja ja ootad vastava teemalist kirja.
					</p>
				</div>

				<div className=' dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow'>
					<div className='flex items-center gap-3 mb-4'>
						<MdRule className='text-3xl text-purple-500' />
						<h2 className='text-2xl md:text-3xl font-bold'>Reeglid</h2>
					</div>
					<hr className='border-gray-300 dark:border-gray-600 mb-4' />
					<ul className='space-y-3'>
						<li className='flex items-start gap-3'>
							<span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0 mt-1'>
								1
							</span>
							<span className='text-base md:text-lg'>
								Iga õige vastuse eest saad{" "}
								<span className='font-semibold text-yellow-500'>ühe</span>{" "}
								punkti.
							</span>
						</li>
						<li className='flex items-start gap-3'>
							<span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0 mt-1'>
								2
							</span>
							<span className='text-base md:text-lg'>
								Mäng{" "}
								<span className='font-semibold text-yellow-500'>lõppeb</span>,
								kui vastad valesti või aeg saab otsa.
							</span>
						</li>
					</ul>
				</div>
			</div>

			<div className='flex justify-center'>
				<button
					className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-lg shadow-lg'
					onClick={() => navigate("/")}
				>
					<FaHome className='text-2xl' />
					Tagasi Avalehele
				</button>
			</div>
		</div>
	);
};

export default Info;
