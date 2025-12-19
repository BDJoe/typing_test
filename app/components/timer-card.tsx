import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	roundTime: number;
}

const TimerCard = ({ roundTime }: Props) => {
	return (
		<div
			className='flex justify-center items-center gap-5'
			id='progressTextContainer'
		>
			<div
				className='bg-[#1a1a1a] border-[#333333] border-2 rounded-lg px-4 py-3 text-base font-semibold text-white flex items-center gap-2 w-fit z-50'
				id='timer'
			>
				<FontAwesomeIcon icon={faClock} className='text-[#666666] text-2xl' />
				<select
					className='border border-white rounded-lg mx-2 px-3 py-1.5 text-base font-semibold text-white'
					id='roundTimerSelect'
					defaultValue={roundTime}
				>
					<option value='30'>30</option>
					<option value='60'>60</option>
					<option value='90'>90</option>
					<option value='120'>120</option>
				</select>
				<div id='progressText'>Time Interval</div>
			</div>
		</div>
	);
};

export default TimerCard;
