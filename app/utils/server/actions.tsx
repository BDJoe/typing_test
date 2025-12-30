"use server";
import { RoundResult } from "@/types/types";
import { cookies } from "next/headers";

// TODO: Remove the line below once proper SSL certificates are set up on the API server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export async function getRandomQuote(minLength: number, maxLength: number) {
	const res = await fetch(
		`https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`
	).then((res) => {
		if (!res.ok) {
			throw new Error("Failed to fetch quote");
		}
		return res;
	});
	const data = await res.json().then((data) => data);
	return data.content;
}

export async function setCookie(name: string, value: string) {
	const cookieStore = await cookies();
	cookieStore.set(name, value);
}

export async function getCookie(name: string) {
	const cookieStore = await cookies();
	return cookieStore.get(name)?.value;
}

export async function saveResults(results: RoundResult) {
	const cookieStore = await cookies();
	const existingResults = cookieStore.get("results")?.value;
	let resultsArray: RoundResult[] = [];
	if (existingResults) {
		resultsArray = JSON.parse(existingResults);
	}
	resultsArray.push(results);
	cookieStore.set("results", JSON.stringify(resultsArray));
}

export async function getResults(): Promise<RoundResult[]> {
	const cookieStore = await cookies();
	const existingResults = cookieStore.get("results")?.value;
	if (existingResults) {
		return JSON.parse(existingResults);
	}
	return [];
}
