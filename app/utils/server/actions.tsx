"use server";
import prisma from "@/lib/prisma";
import { GameConfig, RoundResult } from "@/utils/types/types";

// TODO: Remove the line below once proper SSL certificates are set up on the API server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export async function getRandomQuote(minLength: number, maxLength: number) {
	const res = fetch(
		`https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`
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
	await prisma.testResult.create({
		data: {
			wpm: result.wpm,
			accuracy: result.accuracy,
			totalChars: result.totalChars,
			timeElapsed: result.timeElapsed * 60,
			text: result.text,
			timestamp: result.timestamp,
			userId: userId,
		},
	});
};

export async function getResults(userId: string): Promise<RoundResult[]> {
	const results = await prisma.testResult.findMany({
		where: {
			userId: userId,
		},
		orderBy: {
			timestamp: "desc",
		},
	});
	return results;
}
