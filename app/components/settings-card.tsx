import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	setRoundTime: (newTime: number) => void;
	capitalsEnabled: boolean;
	punctuationEnabled: boolean;
	setCapitals: () => void;
	setPunctuation: () => void;
	setGameMode: (mode: string) => void;
	gameMode: string;
	quoteLength: string;
	setQuoteLength: (length: string) => void;
}

const SettingsCard = ({
	setRoundTime,
	setCapitals,
	setPunctuation,
	capitalsEnabled,
	punctuationEnabled,
	setGameMode,
	gameMode,
	quoteLength,
	setQuoteLength,
}: Props) => {
	return (
		<div className='flex justify-center items-center gap-5 h-15'>
			<div className='bg-[#1a1a1a] border-[#333333] border-2 rounded-lg px-3 py-3 text-base font-semibold text-white flex items-center gap-2 w-fit h-full z-50'>
				<button
					className={
						gameMode === "words"
							? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
							: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
					}
					onClick={() => setGameMode("words")}
				>
					Words
				</button>
				<button
					className={
						gameMode === "quote"
							? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
							: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
					}
					onClick={() => setGameMode("quote")}
				>
					Quote
				</button>
			</div>
			{/* Words/Time Card */}
			<div
				className={`flex justify-center items-center gap-5 h-15 transition-all duration-300 ease-in-out ${
					gameMode === "words" ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className='bg-[#1a1a1a] border-[#333333] border-2 rounded-lg px-3 py-3 text-base font-semibold text-white flex items-center gap-2 w-fit h-full z-50'>
					<FontAwesomeIcon icon={faClock} className='text-[#666666] text-2xl' />
					<select
						className='border border-white rounded-lg bg-[#1a1a1a] mx-2 px-3 py-1 text-base font-semibold text-white'
						id='roundTimerSelect'
						defaultValue={60}
						onChange={(e) => setRoundTime(Number(e.target.value))}
					>
						<option value='30'>30</option>
						<option value='60'>60</option>
						<option value='90'>90</option>
						<option value='120'>120</option>
					</select>
					<div>Time</div>
				</div>
				<div className='bg-[#1a1a1a] border-[#333333] border-2 rounded-lg px-4 py-3 text-base font-semibold text-white flex items-center gap-4 w-fit h-full z-50'>
					<button
						className={
							capitalsEnabled
								? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
								: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
						}
						onClick={setCapitals}
					>
						Capital
					</button>
					<button
						className={
							punctuationEnabled
								? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
								: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
						}
						onClick={setPunctuation}
					>
						Punctuation
					</button>
				</div>
			</div>
			{/* Quotes Card */}
			<div
				className={`flex justify-center items-center gap-5 h-15 transition-all duration-300 ease-in-out absolute ${
					gameMode === "quote" ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className='bg-[#1a1a1a] border-[#333333] border-2 rounded-lg px-4 py-3 text-base font-semibold text-white flex items-center gap-4 w-fit h-full z-50'>
					<button
						className={
							quoteLength === "short"
								? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
								: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
						}
						onClick={() => setQuoteLength("short")}
					>
						Short
					</button>
					<button
						className={
							quoteLength === "medium"
								? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
								: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
						}
						onClick={() => setQuoteLength("medium")}
					>
						Medium
					</button>
					<button
						className={
							quoteLength === "long"
								? "px-3 py-1.5 bg-amber-300 rounded-md text-black hover:bg-amber-400"
								: "px-3 py-1.5 bg-gray-500 rounded-md text-black hover:bg-gray-600"
						}
						onClick={() => setQuoteLength("long")}
					>
						Long
					</button>
				</div>
			</div>
		</div>
	);
};

export default SettingsCard;
