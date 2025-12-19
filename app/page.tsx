"use client";
import Header from "@/components/header";
import StatCard from "@/components/stat-card";
import ProgressBar from "@/components/progress-bar";
import TimerCard from "@/components/timer-card";
import StartButton from "@/components/buttons/start-button";
import ResetButton from "@/components/buttons/reset-button";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

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
	const [timer, setTimer] = useState(null);
	const [isActive, setIsActive] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const cursorRef = useRef<HTMLDivElement>(null);
	const textContentRef = useRef<HTMLDivElement>(null);

	const loadNewText = () => {
		setCurrentText(texts[Math.floor(Math.random() * texts.length)]);
	};

	const resetTest = () => {
		loadNewText();
		//setCurrentIndex(0);
		setErrors(0);
		setTotalChars(0);
		setIsActive(false);
		if (inputRef.current) {
			inputRef.current.disabled = true;
			inputRef.current.value = "";
		}
		if (cursorRef.current) {
			setCursorPosition();
		}
	};

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

	useMemo(() => {
		resetTest();
	}, [currentText]);

	const startTest = () => {
		setIsActive(true);
		//setStartTime(Date.now());
		if (inputRef.current) {
			inputRef.current.disabled = false;
			inputRef.current.focus();
		}
		// Additional logic to start the test can be added here
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

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isActive) return;

		//setCurrentIndex(e.target.value.length);
		setTotalChars(e.target.value.length);
		updateDisplay(e.target.value);
		setCursorPosition(e.target.value);
		setTotalChars(e.target.value.length);
		// Logic to compare input with currentText and update styles accordingly
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

	return (
		<div className='max-md:py-8 max-md:px-6 max-md:m-4 flex min-h-screen items-center justify-center font-mono p-20 leading-[1.6]'>
			{/*^ Body ^*/}
			{/* Main Container */}
			<div className='max-w-250 w-full bg-[#111111] rounded-2xl border-[#222222] border-2 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'>
				{/* Header */}
				<Header />
				{/* Statistics Display */}
				<div className='max-md:grid-cols-1 max-md:gap-4 grid auto-fit-180 gap-6 mb-12'>
					<StatCard icon='fa-solid fa-gauge-high' value={0} label='WPM' />
					<StatCard icon='fa-solid fa-bullseye' value={100} label='Accuracy' />
					<StatCard
						icon='fa-solid fa-keyboard'
						value={totalChars}
						label='Characters'
					/>
				</div>
				{/* Progress Bar and Timer */}
				<div className='mb-5'>
					<ProgressBar />
					<TimerCard roundTime={60} />
				</div>
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
						disabled={!isActive}
						autoFocus
						autoComplete='off'
						spellCheck='false'
						onChange={handleInput}
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
