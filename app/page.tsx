"use client";
import Header from "@/components/header";
import StatCard from "@/components/stat-card";
import ProgressBar from "@/components/progress-bar";
import SetTimerCard from "@/components/set-timer-card";
import StartButton from "@/components/buttons/start-button";
import ResetButton from "@/components/buttons/reset-button";
import { RefObject, use, useEffect, useMemo, useRef, useState } from "react";
import { start } from "repl";
import { time } from "console";

export default function Home() {
	const texts = [
		"The art of programming is the art of organizing complexity. Good code is its own best documentation. When you feel the need to write a comment, first try to refactor the code so that any comment becomes superfluous.",
		"Design is not just what it looks like and feels like. Design is how it works. The best way to find out if you can trust somebody is to trust them. Innovation distinguishes between a leader and a follower.",
		"The only way to do great work is to love what you do. Stay hungry, stay foolish. Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
		"Technology is best when it brings people together. The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
		"Simplicity is the ultimate sophistication. It takes a lot of hard work to make something simple, to truly understand the underlying challenges and come up with elegant solutions.",
		"The future belongs to those who believe in the beauty of their dreams. Success is not final, failure is not fatal, it is the courage to continue that counts.",
	];

	// Global variables
	const [currentText, setCurrentText] = useState("");
	//const [currentIndex, setCurrentIndex] = useState(0);
	const [errors, setErrors] = useState(0);
	const [totalChars, setTotalChars] = useState(0);
	const [textContent, setTextContent] = useState<string[][]>([]);
	const [startTime, setStartTime] = useState(null);
	const [roundTime, setRoundTime] = useState(60);
	const [timeLeft, setTimeLeft] = useState(60);
	const [isActive, setIsActive] = useState(false);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(100);

	const inputRef = useRef<HTMLInputElement>(null);
	const cursorRef = useRef<HTMLDivElement>(null);
	const textContentRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const setCursorPosition = (inputValue = "") => {
		if (!textContentRef.current) return;
		if (!cursorRef.current) return;

		const chars: HTMLCollectionOf<HTMLSpanElement> = textContentRef.current
			.children as HTMLCollectionOf<HTMLSpanElement>;

		const offsetLeft = chars[inputValue.length]
			? chars[inputValue.length].offsetLeft
			: chars[chars.length - 1].offsetLeft +
			  chars[chars.length - 1].offsetWidth;
		const offsetTop = chars[inputValue.length]
			? chars[inputValue.length].offsetTop
			: chars[chars.length - 1].offsetTop;

		cursorRef.current.style.left = `${offsetLeft - 7.5}px`;
		cursorRef.current.style.top = `${offsetTop - 9}px`;
	};

	const loadNewText = () => {
		setCurrentText(texts[Math.floor(Math.random() * texts.length)]);
	};

	const startTimer = (round) => {
		if (timerRef.current) return;
		setTimeLeft(round);
		setStartTime(Date.now());
		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
	};

	const stopTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const resetTest = () => {
		loadNewText();
		setErrors(0);
		setTotalChars(0);
		setIsActive(false);
		if (inputRef.current) {
			inputRef.current.disabled = false;
			inputRef.current.value = "";
			inputRef.current.focus();
		}
		if (cursorRef.current) {
			setCursorPosition();
		}
		stopTimer();
		setTimeLeft(roundTime);
	};

	useMemo(() => {
		resetTest();
	}, [currentText]);

	const startTest = () => {
		setIsActive(true);
		// if (inputRef.current) {
		// 	inputRef.current.disabled = false;
		// 	inputRef.current.focus();
		// }
		startTimer(roundTime);
	};

	const endTest = () => {
		setIsActive(false);
		if (inputRef.current) {
			inputRef.current.disabled = true;
		}
		stopTimer();
		setTimeLeft(roundTime);
		// Additional logic to end the test can be added here
	};

	useEffect(() => {
		setTextContent(
			currentText
				.split("")
				.map((char) => [
					char,
					"text-[#666666] relative transition-all duration-150 ease-in-out",
				])
		);
	}, [currentText]);

	const handleBlur = () => {
		if (isActive && inputRef.current) {
			setIsActive(false);
		}
	};

	const handleFocus = () => {
		if (!isActive && inputRef.current) {
			setIsActive(true);
		}
	};

	const updateDisplay = (input: string) => {
		let errorCount = 0;
		const updatedContent = textContent.map((char, index) => {
			let className = "relative transition-all duration-150 ease-in-out";
			if (index < input.length) {
				if (input[index] === char[0]) {
					className =
						"text-green-500 relative transition-all duration-150 ease-in-out";
				} else {
					className =
						"text-red-500 relative transition-all duration-150 ease-in-out";
					errorCount++;
					if (char[0] === " ") {
						className += " underline";
					}
				}
			} else if (index === input.length && index < currentText.length) {
				className =
					"text-[#666666] relative transition-all duration-150 ease-in-out";
			} else {
				className =
					"text-[#666666] relative transition-all duration-150 ease-in-out";
			}

			return [char[0], className];
		});
		setErrors(errorCount);
		setTextContent(updatedContent);
	};

	const updateStats = () => {
		const timeElapsed = (Date.now() - startTime) / 1000 / 60;
		const grossWPM = totalChars / 5 / timeElapsed;
		const netWPM = Math.max(0, Math.round(grossWPM - errors / timeElapsed));
		const accuracy =
			totalChars > 0
				? Math.round(((totalChars - errors) / totalChars) * 100)
				: 100;

		setWpm(isFinite(netWPM) ? netWPM : 0);
		setAccuracy(accuracy);
	};

	useEffect(() => {
		if (isActive) {
			startTimer(roundTime);
		}
		return () => {
			stopTimer();
		};
	}, []);

	useEffect(() => {
		if (timeLeft <= 0) {
			endTest();
			updateStats();
		}
	}, [timeLeft]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isActive) startTest();

		//setCurrentIndex(e.target.value.length);
		setTotalChars(e.target.value.length);
		updateDisplay(e.target.value);
		setCursorPosition(e.target.value);
		setTotalChars(e.target.value.length);
		updateStats();
		if (e.target.value.length >= currentText.length) {
			endTest();
		}
		// Logic to compare input with currentText and update styles accordingly
	};

	return (
		<div className='max-md:py-8 max-md:px-6 max-md:m-4 flex min-h-screen items-center justify-center font-mono p-20 leading-[1.6]'>
			{/*^ Body ^*/}
			{/* Main Container */}
			<div className='max-w-250 w-full bg-[#111111] rounded-2xl border-[#222222] border-2 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'>
				{/* Header */}
				<Header />
				{/* Setting */}
				<div className='mb-10'>
					<SetTimerCard setRoundTime={(e) => setRoundTime(e)} />
				</div>
				{/* Statistics Display */}
				<div className='max-md:grid-cols-1 max-md:gap-4 grid auto-fit-180 gap-6 mb-12'>
					<StatCard icon='fa-solid fa-gauge-high' value={wpm} label='WPM' />
					<StatCard
						icon='fa-solid fa-bullseye'
						value={accuracy}
						label='Accuracy'
					/>
					{isActive && (
						<StatCard
							icon='fa-solid fa-clock'
							value={timeLeft}
							label='Time Left'
						/>
					)}
					<StatCard
						icon='fa-solid fa-keyboard'
						value={totalChars}
						label='Characters'
					/>
				</div>
				{/* Progress Bar and Timer */}
				<ProgressBar timeLeft={timeLeft} roundTime={roundTime} />

				{/* Typing Area */}
				<div className='max-md:p-6 max-md:text-base bg-[#1a1a1a] border-[#333333] border-2 rounded-xl p-8 mb-8 text-2xl leading-[1.8] relative min-h-30 flex items-center'>
					<span
						className='absolute top-8 bg-[#1a1a1a] left-6 h-[1.2em] animate-pulse transition-all duration-100 ease-in-out'
						ref={cursorRef}
					>
						|
					</span>
					<div className='w-full' ref={textContentRef}>
						{textContent.map((char, index) => (
							<span key={index} className={char[1]}>
								{char[0]}
							</span>
						))}
					</div>
					<input
						type='text'
						className='absolute w-full h-full left-0 top-0 opacity-0'
						ref={inputRef}
						autoFocus
						autoComplete='off'
						spellCheck='false'
						onChange={handleInput}
						onBlur={handleBlur}
						onFocus={handleFocus}
					/>
				</div>
				{/* Control Buttons */}
				<div className='max-md:flex-col max-md:items-center flex gap-4 justify-center flex-wrap'>
					<StartButton startTest={startTest} />
					<ResetButton reset={loadNewText} />
				</div>
			</div>
		</div>
	);
}
