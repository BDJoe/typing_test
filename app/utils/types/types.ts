export type RoundResult = {
	id?: number;
	wpm: number;
	accuracy: number;
	totalChars: number;
	timeElapsed: number;
	gameConfig: GameConfig;
	text: string;
	timestamp: Date;
	roundTimePerSecond: Array<number>;
	errorsPerSecond: Array<number>;
	wpmPerSecond: Array<number>;
};

export type GameConfig = {
	capitalsEnabled: boolean;
	punctuationEnabled: boolean;
	roundTime: number;
	gameMode: string;
	quoteLength: string;
};
