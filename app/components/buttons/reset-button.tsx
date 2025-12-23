import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	reset: () => void;
}
const ResetButton = ({ reset }: Props) => {
	return (
		<button
			className='max-md:w-full max-md:max-w-50 max-md:justify-center inline-flex items-center gap-2 py-3 px-6 text-base font-medium rounded-lg transition-all duration-200 ease-in-out hover:bg-[#f0f0f0] outline-none bg-transparent text-white border border-white hover:border-[#666666] hover:text-black hover:-translate-y-px'
			id='resetBtn'
			onClick={reset}
		>
			<FontAwesomeIcon icon={faRedo} />
			New Test
		</button>
	);
};

export default ResetButton;
