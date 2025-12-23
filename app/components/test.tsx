"use client";
import { getRandomWords } from "@/utils/get-random-words";
import { useEffect, useMemo, useRef, useState } from "react";
import ResetButton from "./buttons/reset-button";
import ProgressBar from "./progress-bar";
import SettingsCard from "./settings-card";
import { RoundResult } from "@/types/types";
import StatCard from "./stat-card";

const Test = () => {
	const [currentText, setCurrentText] = useState(
		getRandomWords(50, false, false)
	);
	const [textContent, setTextContent] = useState<string[][]>([]);
	const [isFocused, setIsFocused] = useState(true);
	const [capitalsEnabled, setCapitalsEnabled] = useState(false);
	const [punctuationEnabled, setPunctuationEnabled] = useState(false);
	const [errors, setErrors] = useState(0);
	const [totalChars, setTotalChars] = useState(0);
	const [roundTime, setRoundTime] = useState(60);
	const [timeLeft, setTimeLeft] = useState(60);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [results, setResults] = useState<RoundResult | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	console.log(roundComplete, results);

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const cursorRef = useRef<HTMLDivElement>(null);
	const textContentRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const loadNewText = () => {
		setCurrentText(getRandomWords(50, capitalsEnabled, punctuationEnabled));
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

	// TIMER LOGIC

	const startTimer = (round: number) => {
		if (timerRef.current) return;
		setTimeLeft(round);
		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
	};

	const resumeTimer = () => {
		if (!timerRef.current) {
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		}
	};

	const stopTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const resetTest = () => {
		setIsActive(false);
		setIsPaused(false);
		setRoundComplete(false);
		setResults(null);
		setErrors(0);
		setTotalChars(0);
		if (inputRef.current) {
			inputRef.current.disabled = false;
			inputRef.current.value = "";
			inputRef.current.focus();
			setIsFocused(true);
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
		setIsFocused(true);
		startTimer(roundTime);
	};

	const endTest = () => {
		if (inputRef.current) inputRef.current.disabled = true;
		setIsActive(false);
		stopTimer();
		updateStats();
		setRoundComplete(true);
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
			setIsPaused(true);
			setIsFocused(false);
			stopTimer();
		}
	};

	const handleFocus = () => {
		if (isPaused && inputRef.current) {
			inputRef.current.focus();
			setIsPaused(false);
			setIsFocused(true);
			resumeTimer();
		}
	};

	useEffect(() => {
		if (!isFocused) {
			inputRef.current?.focus();
		}
	}, [isFocused]);

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
			} else if (index < currentText.length) {
				className =
					"text-[#666666] relative transition-all duration-150 ease-in-out";
			}

			return [char[0], className];
		});
		setErrors(errorCount);
		setTextContent(updatedContent);
	};

	const updateStats = () => {
		const timeElapsed = (roundTime - timeLeft) / 60;
		const grossWPM = totalChars / 5 / timeElapsed;
		const netWPM = Math.max(0, Math.round(grossWPM - errors / timeElapsed));
		const accuracy =
			totalChars > 0
				? Math.round(((totalChars - errors) / totalChars) * 100)
				: 100;

		setResults({
			wpm: netWPM,
			accuracy,
			totalChars,
		});
	};

	useEffect(() => {
		if (isActive && !isPaused) {
			startTimer(roundTime);
		}
		return () => {
			stopTimer();
		};
	}, []);

	useEffect(() => {
		if (timeLeft <= 0) {
			endTest();
		}
	}, [timeLeft]);

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (!isActive) startTest();

		setTotalChars(e.target.value.length);
		updateDisplay(e.target.value);
		setCursorPosition(e.target.value);
		updateStats();
		if (e.target.value.length >= currentText.length) {
			endTest();
		}
	};

	const handleSetRoundTime = (time: number) => {
		setRoundTime(time);
		setTimeLeft(time);
	};

	const handleSettings = (setting: string) => {
		if (setting === "capitals") {
			setCapitalsEnabled(!capitalsEnabled);
		} else if (setting === "punctuation") {
			setPunctuationEnabled(!punctuationEnabled);
		}
	};

	useMemo(() => {
		loadNewText();
	}, [capitalsEnabled, punctuationEnabled]);

	return (
		<>
			{/* Results Container */}
			<div
				className={`max-w-250 w-full bg-[#111111] rounded-2xl border-[#222222] border-2 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out absolute ${
					roundComplete && results
						? "opacity-100"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<div className='text-center mb-12'>
					<h1 className='max-md:text-[2rem] text-4xl font-bold mb-2 tracking-tight'>
						Test Complete
					</h1>
					<p className='text-[#888888] text-base font-normal'>
						Check your results below
					</p>
				</div>
				<div className='max-md:grid-cols-1 max-md:gap-4 grid auto-fit-180 gap-6 mb-12'>
					<StatCard
						icon='fa-solid fa-gauge-high'
						value={results?.wpm ? results?.wpm : 0}
						label='WPM'
					/>
					<StatCard
						icon='fa-solid fa-bullseye'
						value={results?.accuracy ? results?.accuracy : 0}
						label='Accuracy'
					/>
					<StatCard
						icon='fa-solid fa-keyboard'
						value={results?.totalChars ? results?.totalChars : 0}
						label='Characters'
					/>
				</div>
				<div className='max-md:flex-col max-md:items-center flex gap-4 justify-center flex-wrap'>
					<ResetButton reset={loadNewText} />
				</div>
			</div>
			{/* Test Container Wrapper */}
			<div
				className={`transition-all duration-300 ease-in-out absolute ${
					!roundComplete ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				{!isFocused && isActive && (
					<div
						className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white z-10000'
						onClick={() => {
							inputRef.current?.focus();
						}}
					>
						<h2 className='text-3xl font-bold mb-4'>
							Click to focus and continue typing
						</h2>
						<p className='text-lg'>The test is paused while unfocused.</p>
					</div>
				)}
				<div
					className={
						isPaused && isActive
							? "blur-sm transition-blur duration-300 ease-in-out"
							: "transition-blur duration-300 ease-in-out"
					}
					onBlur={handleBlur}
					onFocus={handleFocus}
				>
					{/*  Main Test Container */}
					<div
						className='max-w-250 w-full bg-[#111111] rounded-2xl border-[#222222] border-2 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
						onClick={() => inputRef.current?.focus()}
					>
						{/* Header */}
						<div className='text-center mb-12'>
							<h1 className='max-md:text-[2rem] text-4xl font-bold mb-2 tracking-tight'>
								TypeTest
							</h1>
							<p className='text-[#888888] text-base font-normal'>
								Measure your typing speed and accuracy
							</p>
						</div>
						{/* Setting */}
						<div
							className={`transition-all duration-300 ease-in-out mb-0 ${
								!isActive && !isPaused ? "opacity-100" : "opacity-0"
							}`}
						>
							<SettingsCard
								setRoundTime={handleSetRoundTime}
								capitalsEnabled={capitalsEnabled}
								setCapitals={() => {
									handleSettings("capitals");
								}}
								punctuationEnabled={punctuationEnabled}
								setPunctuation={() => {
									handleSettings("punctuation");
								}}
							/>
						</div>
						{/* Progress Bar and Timer */}
						<div
							className={`transition-all duration-300 ease-in-out ${
								isActive ? "opacity-100 mb-20" : "opacity-0 mb-0"
							}`}
						>
							<ProgressBar timeLeft={timeLeft} roundTime={roundTime} />
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
							<textarea
								className='fixed w-1 h-1 left-0 top-0 opacity-0 pointer-events-none'
								ref={inputRef}
								autoFocus
								autoComplete='off'
								spellCheck='false'
								onChange={handleInput}
								onKeyDown={(e) => {
									if (e.ctrlKey && e.key === "z") {
										e.preventDefault();
										console.log("Undo is disabled");
									}
								}}
								onCopy={(e) => {
									e.preventDefault();
									return false;
								}}
								onPaste={(e) => {
									e.preventDefault();
									return false;
								}}
							/>
						</div>
						{/* Control Buttons */}
						<div className='max-md:flex-col max-md:items-center flex gap-4 justify-center flex-wrap'>
							{/* <StartButton startTest={startTest} /> */}
							<ResetButton reset={loadNewText} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Test;
