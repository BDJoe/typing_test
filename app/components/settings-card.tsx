import { GameConfig } from "@/lib/types/types";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface Props {
	config: GameConfig;
	handleSettingChange: (setting: string, value: string) => void;
}

const SettingsCard = ({ config, handleSettingChange }: Props) => {
	const setRoundTime = (newTime: number) => {
		handleSettingChange("roundTime", newTime.toString());
	};
	const setCapitals = () => {
		handleSettingChange("capitalsEnabled", "");
	};
	const setPunctuation = () => {
		handleSettingChange("punctuationEnabled", "");
	};
	const setGameMode = (mode: string) => {
		handleSettingChange("gameMode", mode);
	};
	const setQuoteLength = (length: string) => {
		handleSettingChange("quoteLength", length);
	};
	return (
		<div className='flex items-center justify-center gap-3'>
			<div className='flex justify-center items-center gap-5 w-fit rounded-xl h-18 bg-background border-2'>
				<div className=' px-4 text-base font-semibold flex items-center gap-3 w-fit h-full z-50 relative'>
					<button
						className={
							config.gameMode === "words"
								? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
								: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
						}
						onClick={() => setGameMode("words")}
					>
						Timed
					</button>
					<button
						className={
							config.gameMode === "quote"
								? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
								: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
						}
						onClick={() => setGameMode("quote")}
					>
						Quote
					</button>
				</div>
			</div>
			{/* Words/Time Card */}
			<div className='flex justify-center items-center gap-5 w-fit rounded-xl h-18 bg-background border-2'>
				<div
					className={`flex justify-center items-center gap-5 h-15 w-fit transition-all duration-300 ease-in-out ${
						config.gameMode === "words" ? "opacity-100" : "opacity-0"
					}`}
				>
					<div className=' px-4 text-base font-semibold flex items-center gap-3 w-fit h-full z-50'>
						<FontAwesomeIcon
							icon={faClock}
							className='text-foreground text-2xl'
						/>
						<Select
							onValueChange={(value) => setRoundTime(Number(value))}
							value={config.roundTime.toString()}
						>
							<SelectTrigger className='border-2 rounded-lg mx-2 px-3 py-1 text-base font-semibold text-foreground bg-background'>
								<SelectValue placeholder={config.roundTime} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='30' className='rounded-ls text-xl'>
									30s
								</SelectItem>
								<SelectItem value='60' className='rounded-ls text-xl'>
									60s
								</SelectItem>
								<SelectItem value='90' className='rounded-ls text-xl'>
									90s
								</SelectItem>
								<SelectItem value='120' className='rounded-ls text-xl'>
									120s
								</SelectItem>
							</SelectContent>
						</Select>
						<div>Time</div>
					</div>
					<div className=' px-4 text-base font-semibold flex items-center gap-3 w-fit h-full z-50'>
						<button
							className={
								config.capitalsEnabled
									? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
									: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
							}
							onClick={setCapitals}
						>
							Capital
						</button>
						<button
							className={
								config.punctuationEnabled
									? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
									: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
							}
							onClick={setPunctuation}
						>
							Punctuation
						</button>
					</div>
				</div>
				{/* Quotes Card */}
				<div
					className={`flex justify-center items-center h-15 w-fit transition-all duration-300 ease-in-out absolute ${
						config.gameMode === "quote" ? "opacity-100" : "opacity-0"
					}`}
				>
					<div className='px-4 text-base font-semibold flex items-center gap-3 w-fit h-full z-50'>
						<button
							className={
								config.quoteLength === "short"
									? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
									: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
							}
							onClick={() => setQuoteLength("short")}
						>
							Short
						</button>
						<button
							className={
								config.quoteLength === "medium"
									? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
									: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
							}
							onClick={() => setQuoteLength("medium")}
						>
							Medium
						</button>
						<button
							className={
								config.quoteLength === "long"
									? "px-3 py-1.5 bg-primary rounded-md text-background hover:bg-primary/80"
									: "px-3 py-1.5 bg-muted rounded-md text-foreground hover:bg-secondary/80"
							}
							onClick={() => setQuoteLength("long")}
						>
							Long
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsCard;
