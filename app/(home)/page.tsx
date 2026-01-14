"use client";
import { useEffect, useRef, useState } from "react";
import ResetButton from "@/components/buttons/reset-button";
import ProgressBar from "@/components/progress-bar";
import SettingsCard from "@/components/settings-card";
import { GameConfig, RoundResult } from "@/lib/types/types";
import StatCard from "@/components/stat-card";
import {
	getRandomWords,
	getRandomQuote,
	getSettings,
	saveResults,
	saveSettings,
} from "@/lib/server/actions";
import { useStopwatch } from "react-timer-hook";
import TextContent from "@/components/text-content";
import { useSession } from "@/lib/auth-client";
import Loading from "@/components/loading";
import Link from "next/link";

const HomePage = () => {
	const { data: session, isPending } = useSession();
	const [config, setConfig] = useState<GameConfig>({
		gameMode: "words",
		capitalsEnabled: false,
		punctuationEnabled: false,
		roundTime: 30,
		quoteLength: "short",
	});

	useEffect(() => {
		const setupTest = async () => {
			let newConfig;
			if (session?.user.id !== undefined && !isPending) {
				const settings = await getSettings(session.user.id);
				if (settings) {
					newConfig = {
						gameMode: settings.mode,
						capitalsEnabled: settings.capitalsEnabled,
						punctuationEnabled: settings.punctuationEnabled,
						roundTime: settings.roundTime,
						quoteLength: settings.quoteLength,
					};
				} else {
					// Set default config if no settings found
					newConfig = {
						gameMode: "words",
						capitalsEnabled: false,
						punctuationEnabled: false,
						roundTime: 30,
						quoteLength: "short",
					};
				}
			} else {
				// Set default config for unauthenticated users
				newConfig = {
					gameMode: "words",
					capitalsEnabled: false,
					punctuationEnabled: false,
					roundTime: 30,
					quoteLength: "short",
				};
			}
			setConfig(newConfig);
			loadNewText(newConfig);
		};
		setupTest();
	}, [isPending, session?.user.id]);

	// STATES
	const [isLoading, setIsLoading] = useState(true);
	const [currentText, setCurrentText] = useState("");
	const [textContent, setTextContent] = useState<string[][]>([]);
	const [isFocused, setIsFocused] = useState(true);
	const [errors, setErrors] = useState(0);
	const [totalChars, setTotalChars] = useState(0);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [results, setResults] = useState<RoundResult | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundStats, setRoundStats] = useState<
		Array<{ time: number; errors: number; wpm: number }>
	>([]);

	// REFS
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const cursorRef = useRef<HTMLDivElement>(null);
	const textContentRef = useRef<HTMLDivElement>(null);
	const resetBtnRef = useRef<HTMLButtonElement>(null);

	const [lineOffsets, setLineOffsets] = useState<Set<number>>(new Set());

	const { totalSeconds, pause, start, reset } = useStopwatch({
		// expiryTimestamp: expiryTimestamp,
		// onExpire: () => endTest(),
		autoStart: false,
	});

	// LOAD NEW TEXT LOGIC
	const loadNewText = async (settings: GameConfig) => {
		setIsLoading(true);
		if (settings.gameMode === "quote") {
			try {
				let minLength = 0;
				let maxLength = 0;
				if (settings.quoteLength === "short") {
					minLength = 75;
					maxLength = 150;
				} else if (settings.quoteLength === "medium") {
					minLength = 200;
					maxLength = 300;
				} else if (settings.quoteLength === "long") {
					minLength = 325;
					maxLength = 450;
				}
				const text = await getRandomQuote(minLength, maxLength).then(
					(quote) => quote
				);
				setCurrentText(text);
			} catch (error) {
				console.error("Error fetching new text:", error);
				return "Error fetching new text.";
			}
		} else if (settings.gameMode === "words") {
			const text = await getRandomWords(
				50,
				settings.capitalsEnabled,
				settings.punctuationEnabled
			);
			setCurrentText(text);
		}
		resetTest();
		setIsLoading(false);
	};

	useEffect(() => {
		setTextContent(
			currentText.split("").map((char) => {
				if (char === "—") {
					return [
						"-",
						"text-foreground relative transition-all duration-150 ease-in-out",
					];
				} else if (char === "’") {
					return [
						"'",
						"text-foreground relative transition-all duration-150 ease-in-out",
					];
				} else {
					return [
						char,
						"text-foreground relative transition-all duration-150 ease-in-out",
					];
				}
			})
		);
	}, [currentText]);

	useEffect(() => {
		if (textContentRef.current) {
			const offsets: Set<number> = new Set();
			const chars: HTMLCollectionOf<HTMLSpanElement> = textContentRef.current
				.children as HTMLCollectionOf<HTMLSpanElement>;
			for (let i = 0; i < chars.length; i++) {
				offsets.add(chars[i].offsetTop);
			}
			setLineOffsets(offsets);
		}
	}, [textContent]);

	// GAME LOGIC
	const resetTest = () => {
		setIsActive(false);
		setIsPaused(false);
		setRoundComplete(false);
		setResults(null);
		setRoundStats([]);
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
		reset(new Date(), false);
	};

	const startTest = () => {
		setIsActive(true);
		setIsFocused(true);
		reset(new Date(), false);
		start();
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
			start();
		}
	};

	useEffect(() => {
		if (!isFocused && !roundComplete) {
			inputRef.current?.focus();
		}
	}, [isFocused, roundComplete]);

	useEffect(() => {
		if (totalSeconds >= config.roundTime && config.gameMode === "words") {
			endTest();
		}
		if (isActive && !roundComplete) {
			const timeElapsed = totalSeconds;
			const grossWPM = totalChars / 5 / (timeElapsed / 60);
			const errorsPerSecond = () => {
				if (roundStats.length > 0) {
					return Math.max(errors - roundStats[roundStats.length - 1].errors, 0);
				} else {
					return errors;
				}
			};
			if (totalSeconds > 0)
				setRoundStats([
					...roundStats,
					{
						time: timeElapsed,
						errors: errorsPerSecond(),
						wpm: grossWPM,
					},
				]);
		}
	}, [totalSeconds]);

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
					"text-foreground relative transition-all duration-150 ease-in-out";
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

		const midLineOffset = [...lineOffsets].at(1);

		textContentRef.current.scroll({
			top: offsetTop - midLineOffset,
			behavior: "auto",
		});

		cursorRef.current.style.left = `${offsetLeft - 7.5}px`;
		cursorRef.current.style.top = `${
			offsetTop - textContentRef.current.scrollTop - 7.5
		}px`;
		console.log(
			offsetLeft,
			offsetTop,
			textContentRef.current.scrollTop,
			chars[inputValue.length].innerText
		);
	};

	// UPDATE STATS LOGIC
	const updateStats = () => {
		const timeElapsed = totalSeconds;
		const grossWPM = totalChars / 5 / (timeElapsed / 60);
		const netWPM = Math.max(
			0,
			Math.round(grossWPM - errors / (timeElapsed / 60))
		);
		const accuracy =
			totalChars > 0
				? Math.round(((totalChars - errors) / totalChars) * 100)
				: 100;
		const roundTimePerSecond = roundStats.map((stat) => {
			return stat.time;
		});
		const errorsPerSecond = roundStats.map((stat) => {
			return stat.errors;
		});
		const wpmPerSecond = roundStats.map((stat) => {
			return stat.wpm;
		});
		setResults({
			wpm: netWPM,
			accuracy,
			totalChars,
			timeElapsed,
			gameConfig: config,
			text: currentText.slice(0, totalChars),
			timestamp: new Date(),
			roundTimePerSecond,
			errorsPerSecond,
			wpmPerSecond,
		});

		if (session?.user.id !== undefined) {
			saveResults(
				{
					wpm: netWPM,
					accuracy,
					totalChars,
					timeElapsed,
					gameConfig: config,
					text: currentText.slice(0, totalChars),
					timestamp: new Date(),
					roundTimePerSecond,
					errorsPerSecond,
					wpmPerSecond,
				},
				session?.user.id
			);
		}
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

	const handleSettings = (setting: string, value: string) => {
		let newConfig;
		if (setting === "capitalsEnabled") {
			newConfig = {
				...config,
				capitalsEnabled: !config.capitalsEnabled,
			};
			setConfig(newConfig);
		} else if (setting === "punctuationEnabled") {
			newConfig = {
				...config,
				punctuationEnabled: !config.punctuationEnabled,
			};
			setConfig(newConfig);
		} else if (setting === "gameMode") {
			newConfig = {
				...config,
				gameMode: value,
			};
			setConfig(newConfig);
		} else if (setting === "quoteLength") {
			newConfig = {
				...config,
				quoteLength: value,
			};
			setConfig(newConfig);
		} else {
			newConfig = {
				...config,
				roundTime: parseInt(value),
			};
		}
		setConfig(newConfig);

		if (session?.user.id !== undefined) {
			saveSettings(session?.user.id, newConfig);
		}
		loadNewText(newConfig);
	};

	if (isPending || isLoading) {
		return <Loading />;
	}

	return (
		<div className='flex justify-center p-5 mt-20 font-mono'>
			{/* Results Container */}
			<div
				className={`max-w-250 w-full bg-accent rounded-2xl border-2 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out ${
					roundComplete && results
						? "opacity-100"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<div className='text-center mb-12'>
					<h1 className='max-md:text-[2rem] text-4xl font-bold mb-2 tracking-tight'>
						Test Complete
					</h1>
					<p className='text-base font-normal'>Check your results below</p>
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
				{session?.user === undefined && (
					<div className='text-center mb-5'>
						<Link
							href='/sign-up'
							className='text-primary font-bold hover:text-primary/80 cursor-pointer'
						>
							Register
						</Link>{" "}
						or{" "}
						<Link
							href='/sign-in'
							className='text-primary font-bold hover:text-primary/80 cursor-pointer'
						>
							Sign In
						</Link>{" "}
						to save stats.
					</div>
				)}
				<div className='max-md:flex-col max-md:items-center flex gap-4 justify-center flex-wrap'>
					<ResetButton
						reset={() => loadNewText(config)}
						buttonRef={resetBtnRef}
					/>
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
						className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-10000'
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
						className='max-w-300 px-5'
						onClick={() => inputRef.current?.focus()}
					>
						{/* Setting */}
						<div
							className={`transition-all duration-300 ease-in-out ${
								!isActive && !isPaused ? "opacity-100 mb-10" : "opacity-0 mb-0"
							}`}
						>
							<SettingsCard
								config={config}
								handleSettingChange={(setting, value) =>
									handleSettings(setting, value)
								}
							/>
						</div>
						{/* Progress Bar and Timer */}
						<div
							className={`transition-all duration-300 ease-in-out ${
								isActive ? "opacity-100 mb-10" : "opacity-0 mb-0"
							}`}
						>
							<ProgressBar
								secondsElapsed={totalSeconds}
								config={config}
								charsTyped={totalChars}
								totalChars={textContent.length}
							/>
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
							<ResetButton
								reset={() => loadNewText(config)}
								buttonRef={resetBtnRef}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
