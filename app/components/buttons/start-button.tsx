import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	startTest: () => void;
}

const StartButton = ({ startTest }: Props) => {
	return (
		<button
			className='max-md:w-full max-md:max-w-50 max-md:justify-center inline-flex items-center gap-2 py-3 px-6 text-base font-medium border-none rounded-lg transition-all duration-200 ease-in-out hover:bg-[#f0f0f0] hover:text-black hover:-translate-y-px outline-none bg-black text-white'
			id='startBtn'
			onClick={startTest}
		>
			<FontAwesomeIcon icon={faPlay} />
			Start Test
		</button>
	);
};

export default StartButton;
