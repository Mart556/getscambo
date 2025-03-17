import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Info = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="container mx-auto px-4 md:px-8 h-screen flex flex-col max-h-screen align-middle justify-center">
            <div className="bg-neutral-800/75 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg mt-4 flex flex-col justify-center items-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 underline underline-offset-auto">
                    Mängu reeglid
                </h1>

                <ul className="text-md md:text-2xl text-white list-disc list-inside my-4">
                    <li>
                        Mängu eesmärk on vastata võimalikult paljudele
                        küsimustele või piltidele õigesti.
                    </li>
                    <li>Iga õige vastuse eest saad ühe punkti.</li>
                    <li>Mäng lõppeb, kui vastad valesti või aeg saab otsa.</li>
                    <li>
                        Aega on täpselt <b>üks</b> minut.
                    </li>
                </ul>

                <p className="text-lg md:text-2xl text-white mt-4">
                    Edu mängimisel!
                </p>

                <button
                    className="bg-blue-500 text-white font-bold py-4 w-50 rounded m-3 text-2xl"
                    onClick={handleGoBack}
                >
                    <FontAwesomeIcon icon={faHome} size="lg" className="me-2" />
                    Tagasi
                </button>
            </div>
        </div>
    );
};

export default Info;
