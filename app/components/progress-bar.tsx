import { time } from "console";
import { useEffect, useRef } from "react";

interface Props {
	timeLeft: number;
	roundTime: number;
}
const ProgressBar = ({ timeLeft, roundTime }: Props) => {
	const progressRef = useRef(null);
	const timeRef = useRef(null);

	const updateProgress = () => {
		const progress = ((roundTime - timeLeft) / roundTime) * 100;
		if (!progressRef.current) return;
		progressRef.current.style.width = `${Math.min(progress, 100)}%`;
		if (!timeRef.current) return;
		timeRef.current.style.marginLeft = `${Math.min(progress, 100) - 1}%`;
	};

	useEffect(() => {
		updateProgress();
	}, [timeLeft, roundTime]);

	return (
		<div className='h-3 bg-[#222222] rounded-md mb-8'>
			<div
				className='h-full bg-white rounded-md transition-[width] duration-300 ease-in-out w-0'
				ref={progressRef}
			></div>
			<div
				className='p-0 text-xl font-bold transition-all duration-300 ease-in-out'
				ref={timeRef}
			>
				{timeLeft}s
			</div>
		</div>
	);
};

export default ProgressBar;
