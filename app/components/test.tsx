"use client";
import { useEffect, useRef, useState } from "react";
import ResetButton from "./buttons/reset-button";
import ProgressBar from "./progress-bar";
import SettingsCard from "./settings-card";
import { GameConfig, RoundResult } from "@/types/types";
import StatCard from "./stat-card";
import {
	getCookie,
	getRandomQuote,
	saveResults,
	setCookie,
} from "@/utils/server/actions";
import { getRandomWords } from "@/utils/get-random-words";
import { useTimer } from "react-timer-hook";
import TextContent from "./text-content";

interface Props {
	config: GameConfig;
}
const Test = ({ config }: Props) => {
	// STATES
	const [currentText, setCurrentText] = useState("");
	const [textContent, setTextContent] = useState<string[][]>([]);
	const [isFocused, setIsFocused] = useState(true);
	const [capitalsEnabled, setCapitalsEnabled] = useState(
		config.capitalsEnabled || false
	);
	const [punctuationEnabled, setPunctuationEnabled] = useState(
		config.punctuationEnabled || false
	);
	const [errors, setErrors] = useState(0);
	const [totalChars, setTotalChars] = useState(0);
	const [roundTime, setRoundTime] = useState(config.roundTime || 60);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [results, setResults] = useState<RoundResult | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [gameMode, setGameMode] = useState(config.gameMode || "words");
	const [quoteLength, setQuoteLength] = useState(
		config.quoteLength || "medium"
	);

	// REFS
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const cursorRef = useRef<HTMLDivElement>(null);
	const textContentRef = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	const fetchGameConfig = async () => {
	// 		const configCookie = await getCookie("gameConfig");
	// 		if (configCookie) {
	// 			const config: GameConfig = JSON.parse(configCookie);
	// 			setCapitalsEnabled(config.capitalsEnabled);
	// 			setPunctuationEnabled(config.punctuationEnabled);
	// 			setRoundTime(config.roundTime);
	// 			setGameMode(config.gameMode);
	// 			setQuoteLength(config.quoteLength);
	// 		}
	// 	};
	// 	fetchGameConfig();
	// }, [config]);

	// TIMER LOGIC
	const expiryTimestamp = new Date();
	expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + roundTime); // Set initial expiry time

	const { totalSeconds, pause, resume, restart } = useTimer({
		expiryTimestamp: expiryTimestamp,
		onExpire: () => endTest(),
		autoStart: false,
	});

	const startTimer = (roundTime: number) => {
		const newExpiryTimestamp = new Date();
		if (gameMode === "words") {
			newExpiryTimestamp.setSeconds(
				newExpiryTimestamp.getSeconds() + roundTime
			);
		} else {
			newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + 3600); // 1 hour for quote mode
		}
		restart(newExpiryTimestamp);
	};

	// LOAD NEW TEXT LOGIC
	const loadNewText = async () => {
		if (gameMode === "quote") {
			try {
				let minLength = 0;
				let maxLength = 0;
				if (quoteLength === "short") {
					minLength = 100;
					maxLength = 150;
				} else if (quoteLength === "medium") {
					minLength = 200;
					maxLength = 250;
				} else if (quoteLength === "long") {
					minLength = 275;
					maxLength = 350;
				}
				const text = await getRandomQuote(minLength, maxLength);
				setCurrentText(text);
				return text;
			} catch (error) {
				console.error("Error fetching new text:", error);
				return "Error fetching new text.";
			}
		} else if (gameMode === "words") {
			const text = getRandomWords(50, capitalsEnabled, punctuationEnabled);
			setCurrentText(text);
			return text;
		}
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

	useEffect(() => {
		loadNewText();
	}, [gameMode, capitalsEnabled, punctuationEnabled, quoteLength]);

	// GAME LOGIC
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
		pause();
	};

	useEffect(() => {
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
		pause();
		updateStats();
		setRoundComplete(true);
	};

	// FOCUS AND BLUR HANDLERS
	const handleBlur = () => {
		if (isActive && inputRef.current) {
			setIsPaused(true);
			setIsFocused(false);
			pause();
		}
	};

	const handleFocus = () => {
		if (isPaused && inputRef.current) {
			inputRef.current.focus();
			setIsPaused(false);
			setIsFocused(true);
			resume();
		}
	};

	useEffect(() => {
		if (!isFocused) {
			inputRef.current?.focus();
		}
	}, [isFocused]);

	// UPDATE DISPLAY LOGIC
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

	// SET CURSOR POSITION LOGIC
	const setCursorPosition = (inputValue = "") => {
		if (!textContentRef.current) return;
		if (!cursorRef.current) return;

		const chars: HTMLCollectionOf<HTMLSpanElement> = textContentRef.current
			.children as HTMLCollectionOf<HTMLSpanElement>;
		if (chars.length === 0) return;

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

	// UPDATE STATS LOGIC
	const updateStats = () => {
		const timeElapsed =
			gameMode === "words"
				? (roundTime - totalSeconds) / 60
				: (3600 - totalSeconds) / 60;
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
			timeElapsed,
			gameConfig: config,
			text: currentText.slice(0, totalChars),
			timestamp: new Date(),
		});
		saveResults({
			wpm: netWPM,
			accuracy,
			totalChars,
			timeElapsed,
			gameConfig: config,
			text: currentText.slice(0, totalChars),
			timestamp: new Date(),
		});
	};

	// HANDLERS
	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (!isActive) startTest();

		setTotalChars(e.target.value.length);
		updateDisplay(e.target.value);
		setCursorPosition(e.target.value);

		if (e.target.value.length >= currentText.length) {
			endTest();
		}
	};

	const handleSetRoundTime = (time: number) => {
		setRoundTime(time);
	};

	const handleSettings = (setting: string) => {
		if (setting === "capitals") {
			setCapitalsEnabled(!capitalsEnabled);
			loadNewText();
		} else if (setting === "punctuation") {
			setPunctuationEnabled(!punctuationEnabled);
			loadNewText();
		}
	};

	useEffect(() => {
		config.capitalsEnabled = capitalsEnabled;
		config.punctuationEnabled = punctuationEnabled;
		config.roundTime = roundTime;
		config.gameMode = gameMode;
		config.quoteLength = quoteLength;
		setCookie("gameConfig", JSON.stringify(config));
	}, [capitalsEnabled, punctuationEnabled, roundTime, gameMode, quoteLength]);

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
								roundTime={roundTime}
								setRoundTime={handleSetRoundTime}
								capitalsEnabled={capitalsEnabled}
								setCapitals={() => {
									handleSettings("capitals");
								}}
								punctuationEnabled={punctuationEnabled}
								setPunctuation={() => {
									handleSettings("punctuation");
								}}
								setGameMode={(mode) => setGameMode(mode)}
								gameMode={gameMode}
								quoteLength={quoteLength}
								setQuoteLength={(length) => setQuoteLength(length)}
							/>
						</div>
						{/* Progress Bar and Timer */}
						<div
							className={`transition-all duration-300 ease-in-out ${
								isActive && gameMode === "words"
									? "opacity-100 mb-20"
									: "opacity-0 mb-0"
							}`}
						>
							<ProgressBar timeLeft={totalSeconds} roundTime={roundTime} />
						</div>
						{/* Typing Area */}
						<TextContent
							textContent={textContent}
							inputRef={inputRef}
							textContentRef={textContentRef}
							cursorRef={cursorRef}
							handleInput={handleInput}
						/>
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
