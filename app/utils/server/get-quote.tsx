"use server";
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
