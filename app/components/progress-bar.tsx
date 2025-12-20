import React, { useRef } from "react";

interface Props {
	timeLeft: number;
	roundTime: number;
}
const ProgressBar = ({ timeLeft, roundTime }: Props) => {
	const pregressRef = useRef(null);

	const updateProgress = () => {
		const progress = ((roundTime - timeLeft) / roundTime) * 100;
		if (!pregressRef.current) return;
		pregressRef.current.style.width = `${Math.min(progress, 100)}%`;
	};

	React.useEffect(() => {
		updateProgress();
	}, [timeLeft, roundTime]);

	return (
		<div className='h-3 bg-[#222222] rounded-md overflow-hidden mb-8'>
			<div
				className='h-full bg-white rounded-md transition-[width] duration-300 ease-in-out w-0'
				ref={pregressRef}
			></div>
		</div>
	);
};

export default ProgressBar;
