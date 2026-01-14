import { GameConfig } from "@/lib/types/types";
import { useEffect, useRef } from "react";

interface Props {
	secondsElapsed: number;
	config: GameConfig;
	charsTyped: number;
	totalChars: number;
}
const ProgressBar = ({
	secondsElapsed,
	config,
	charsTyped,
	totalChars,
}: Props) => {
	const progressRef = useRef<HTMLDivElement>(null);
	const timeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateProgress = () => {
			let progress;
			if (config.gameMode === "words") {
				progress = (secondsElapsed / config.roundTime) * 100;
			} else {
				progress = (charsTyped / totalChars) * 100;
			}
			if (!progressRef.current) return;
			progressRef.current.style.width = `${Math.min(progress, 100)}%`;
			if (!timeRef.current) return;
			timeRef.current.style.marginLeft = `${Math.min(progress, 100) - 1}%`;
		};
		updateProgress();
	}, [
		secondsElapsed,
		config.roundTime,
		config.gameMode,
		charsTyped,
		totalChars,
	]);

	return (
		<div className='h-3 bg-accent rounded-md'>
			<div
				className='h-full bg-foreground rounded-md transition-[width] duration-300 ease-in-out w-0'
				ref={progressRef}
			></div>
			<div
				className='p-0 text-xl font-bold transition-all duration-300 ease-in-out'
				ref={timeRef}
			>
				{config.gameMode === "words"
					? `${config.roundTime - secondsElapsed}s`
					: `${((charsTyped / totalChars) * 100).toFixed(0)}%`}
			</div>
		</div>
	);
};

export default ProgressBar;
