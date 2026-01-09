"use client";
import { useEffect, useRef, useState } from "react";
import ResetButton from "@/components/buttons/reset-button";
import ProgressBar from "@/components/progress-bar";
import SettingsCard from "@/components/settings-card";
import { GameConfig, RoundResult } from "@/utils/types/types";
import StatCard from "@/components/stat-card";
import {
	getRandomQuote,
	getSettings,
	saveResults,
	saveSettings,
} from "@/utils/server/actions";
import { getRandomWords } from "@/utils/get-random-words";
import { useTimer } from "react-timer-hook";
import TextContent from "@/components/text-content";
import { useSession } from "@/lib/auth-client";
import Loading from "@/utils/loading";
import RoundChart from "@/components/round-chart";

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
		const fetchSettings = async () => {
			if (session?.user.id !== undefined && !isPending) {
				const settings = await getSettings(session.user.id);
				if (settings) {
					setConfig({
						gameMode: settings.mode,
						capitalsEnabled: settings.capitalsEnabled,
						punctuationEnabled: settings.punctuationEnabled,
						roundTime: settings.roundTime,
						quoteLength: settings.quoteLength,
					});
				} else {
					// Set default config if no settings found
					setConfig({
						gameMode: "words",
						capitalsEnabled: false,
						punctuationEnabled: false,
						roundTime: 30,
						quoteLength: "short",
					});
				}
			} else {
				// Set default config for unauthenticated users
				setConfig({
					gameMode: "words",
					capitalsEnabled: false,
					punctuationEnabled: false,
					roundTime: 30,
					quoteLength: "short",
				});
			}
		};
		fetchSettings();
	}, [isPending, session?.user.id]);

	// useMemo(() => {
	// 	if (initialLoad) {
	// 		setConfig(initialLoad);
	// 	}
	// }, [initialLoad]);

	// STATES
	const [isLoading, setIsLoading] = useState(true);
	const [currentText, setCurrentText] = useState("");
	const [textContent, setTextContent] = useState<string[][]>([]);
	const [isFocused, setIsFocused] = useState(true);
	// const [capitalsEnabled, setCapitalsEnabled] = useState(
	// 	config.capitalsEnabled || false
	// );
	// const [punctuationEnabled, setPunctuationEnabled] = useState(
	// 	config.punctuationEnabled || false
	// );
	const [errors, setErrors] = useState(0);
	const [totalChars, setTotalChars] = useState(0);
	// const [roundTime, setRoundTime] = useState(config.roundTime || 60);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [results, setResults] = useState<RoundResult | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);

	const [roundStats, setRoundStats] = useState<
		Array<{ time: number; errors: number; wpm: number }>
	>([]);
	// const [gameMode, setGameMode] = useState(config.gameMode);
	// const [quoteLength, setQuoteLength] = useState(
	// 	config.quoteLength
	// );

	// REFS
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const cursorRef = useRef<HTMLDivElement>(null);
	const textContentRef = useRef<HTMLDivElement>(null);
	const resetBtnRef = useRef<HTMLButtonElement>(null);

	// TIMER LOGIC
	const expiryTimestamp = new Date();
	expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + config.roundTime); // Set initial expiry time

	const { totalSeconds, pause, resume, restart } = useTimer({
		expiryTimestamp: expiryTimestamp,
		onExpire: () => endTest(),
		autoStart: false,
	});

	const startTimer = (roundTime: number) => {
		const newExpiryTimestamp = new Date();
		if (config.gameMode === "words") {
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
		if (config.gameMode === "quote") {
			try {
				let minLength = 0;
				let maxLength = 0;
				if (config.quoteLength === "short") {
					minLength = 100;
					maxLength = 150;
				} else if (config.quoteLength === "medium") {
					minLength = 200;
					maxLength = 250;
				} else if (config.quoteLength === "long") {
					minLength = 275;
					maxLength = 350;
				}
				const text = await getRandomQuote(minLength, maxLength).then(
					(quote) => quote
				);
				setCurrentText(text);
			} catch (error) {
				console.error("Error fetching new text:", error);
				return "Error fetching new text.";
			}
		} else if (config.gameMode === "words") {
			const text = getRandomWords(
				50,
				config.capitalsEnabled,
				config.punctuationEnabled
			);
			setCurrentText(text);
		}
	};

	useEffect(() => {
		setTextContent(
			currentText
				.split("")
				.map((char) =>
					char === "—"
						? [
								"-",
								"text-foreground relative transition-all duration-150 ease-in-out",
						  ]
						: [
								char,
								"text-foreground relative transition-all duration-150 ease-in-out",
						  ]
				)
		);
	}, [currentText]);

	useEffect(() => {
		setIsLoading(true);
		loadNewText();
		// resetTest();
		setIsLoading(false);
	}, [
		config.gameMode,
		config.capitalsEnabled,
		config.punctuationEnabled,
		config.quoteLength,
	]);

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
		pause();
	};

	useEffect(() => {
		resetTest();
	}, [currentText]);

	const startTest = () => {
		setIsActive(true);
		setIsFocused(true);
		startTimer(config.roundTime);
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
		if (!isFocused && !roundComplete) {
			inputRef.current?.focus();
		}
	}, [isFocused]);

	useEffect(() => {
		if (isActive && !roundComplete) {
			const timeElapsed =
				config.gameMode === "words"
					? (config.roundTime - totalSeconds) / 60
					: (3600 - totalSeconds) / 60;
			const grossWPM = totalChars / 5 / timeElapsed;
			if (timeElapsed > 0) {
				setRoundStats([
					...roundStats,
					{ time: timeElapsed * 60, errors: errors, wpm: grossWPM },
				]);
			}
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

		cursorRef.current.style.left = `${offsetLeft - 7.5}px`;
		cursorRef.current.style.top = `${offsetTop - 7.5}px`;
	};

	// UPDATE STATS LOGIC
	const updateStats = () => {
		const timeElapsed =
			config.gameMode === "words"
				? (config.roundTime - totalSeconds) / 60
				: (3600 - totalSeconds) / 60;
		const grossWPM = totalChars / 5 / timeElapsed;
		const netWPM = Math.max(0, Math.round(grossWPM - errors / timeElapsed));
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

	const handleSettings = (setting: string, value: any) => {
		let newConfig;
		if (setting === "capitalsEnabled") {
			newConfig = {
				...config,
				capitalsEnabled: !config.capitalsEnabled,
			};
			setConfig(newConfig);
			// loadNewText();
		} else if (setting === "punctuationEnabled") {
			newConfig = {
				...config,
				punctuationEnabled: !config.punctuationEnabled,
			};
			setConfig(newConfig);
			// loadNewText();
		} else if (setting === "gameMode") {
			newConfig = {
				...config,
				gameMode: value,
			};
			setConfig(newConfig);
			// loadNewText();
		} else if (setting === "quoteLength") {
			newConfig = {
				...config,
				quoteLength: value,
			};
			setConfig(newConfig);
			// loadNewText();
		} else {
			newConfig = {
				...config,
				roundTime: value,
			};
		}
		setConfig(newConfig);

		if (session?.user.id !== undefined) {
			saveSettings(session?.user.id, newConfig);
		}
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

				<div className='max-md:flex-col max-md:items-center flex gap-4 justify-center flex-wrap'>
					<ResetButton reset={loadNewText} buttonRef={resetBtnRef} />
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
					<div className='max-w-250' onClick={() => inputRef.current?.focus()}>
						{/* Setting */}
						<div
							className={`transition-all duration-300 ease-in-out mb-0 ${
								!isActive && !isPaused ? "opacity-100" : "opacity-0"
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
								isActive && config.gameMode === "words"
									? "opacity-100 mb-20"
									: "opacity-0 mb-0"
							}`}
						>
							<ProgressBar
								timeLeft={totalSeconds}
								roundTime={config.roundTime}
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
							<ResetButton reset={loadNewText} buttonRef={resetBtnRef} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
