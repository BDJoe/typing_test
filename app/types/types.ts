export type RoundResult = {
	wpm: number;
	accuracy: number;
	totalChars: number;
	timeElapsed: number;
	gameConfig: GameConfig;
	text: string;
	timestamp: Date;
};

export type GameConfig = {
	capitalsEnabled: boolean;
	punctuationEnabled: boolean;
	roundTime: number;
	gameMode: string;
	quoteLength: string;
};
