"use server";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { GameConfig, RoundResult } from "@/lib/types/types";
import { promises as fs } from "fs";

const filePath: string = process.cwd() + "/app/lib/data/oxford-5k.txt";

export const getRandomWords = async (
	count: number,
	enableCapitals: boolean,
	enablePunctuation: boolean,
) => {
	const content: string = await fs.readFile(filePath, "utf-8");
	const data = content.split(/\r?\n/);
	const words = [];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * data.length);
		if (enableCapitals) {
			if (randomIndex % 3 === 0)
				words.push(
					data[randomIndex][0].toUpperCase() + data[randomIndex].slice(1),
				);
			else words.push(data[randomIndex].toLowerCase());
		} else {
			words.push(data[randomIndex].toLowerCase());
		}
		if (enablePunctuation) {
			const punctuationMarks = [".", ",", "!", "?", ";", ":"];
			if (randomIndex % 4 === 0) {
				const punctIndex = Math.floor(Math.random() * punctuationMarks.length);
				words[words.length - 1] += punctuationMarks[punctIndex];
			}
		}
	}
	return words.join(" ");
};

// TODO: Remove the line below once proper SSL certificates are set up on the API server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export async function getRandomQuote(minLength: number, maxLength: number) {
	const res = fetch(
		`https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`,
	).then((res) => {
		if (!res.ok) {
			throw new Error("Failed to fetch quote");
		}
		return res.json();
	});
	const data = await res.then((data) => data);
	return data.content;
}

export async function saveSettings(userId: string, settings: GameConfig) {
	await prisma.gameSettings.upsert({
		where: {
			userId: userId,
		},
		update: {
			mode: settings.gameMode,
			capitalsEnabled: settings.capitalsEnabled,
			punctuationEnabled: settings.punctuationEnabled,
			roundTime: settings.roundTime,
			quoteLength: settings.quoteLength,
		},
		create: {
			userId: userId,
			mode: settings.gameMode,
			capitalsEnabled: settings.capitalsEnabled,
			punctuationEnabled: settings.punctuationEnabled,
			roundTime: settings.roundTime,
			quoteLength: settings.quoteLength,
		},
	});
}

export async function getSettings(userId: string) {
	const settings = await prisma.gameSettings.findUnique({
		where: {
			userId: userId,
		},
	});
	return settings;
}

export const saveResults = async (result: RoundResult, userId: string) => {
	const config = {
		capitalsEnabled: result.gameConfig.capitalsEnabled,
		punctuationEnabled: result.gameConfig.punctuationEnabled,
		gameMode: result.gameConfig.gameMode,
		roundTime: result.gameConfig.roundTime,
		quoteLength: result.gameConfig.quoteLength,
	} as Prisma.JsonObject;

	await prisma.testResult.create({
		data: {
			wpm: result.wpm,
			accuracy: result.accuracy,
			totalChars: result.totalChars,
			timeElapsed: result.timeElapsed,
			text: result.text,
			gameConfig: config,
			timestamp: result.timestamp,
			userId: userId,
			roundTimePerSecond: result.roundTimePerSecond,
			errorsPerSecond: result.errorsPerSecond,
			wpmPerSecond: result.wpmPerSecond,
		},
	});
};

export async function getResults(userId: string): Promise<RoundResult[]> {
	const data = await prisma.testResult.findMany({
		where: {
			userId: userId,
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	const results: RoundResult[] = data.map((result) => {
		const config = result.gameConfig as Prisma.JsonObject;
		return {
			id: result.id,
			wpm: result.wpm,
			accuracy: result.accuracy,
			totalChars: result.totalChars,
			timeElapsed: result.timeElapsed,
			gameConfig: {
				capitalsEnabled: config.capitalsEnabled as boolean,
				punctuationEnabled: config.punctuationEnabled as boolean,
				gameMode: config.gameMode as string,
				roundTime: config.roundTime as number,
				quoteLength: config.quoteLength as string,
			},
			text: result.text,
			timestamp: result.timestamp,
			roundTimePerSecond: result.roundTimePerSecond,
			errorsPerSecond: result.errorsPerSecond,
			wpmPerSecond: result.wpmPerSecond,
		};
	});

	return results;
}
