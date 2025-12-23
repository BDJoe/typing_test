import data from "@/data/wordlist.json";

export const getRandomWords = (
	count: number,
	enableCapitals: boolean,
	enablePunctuation: boolean
) => {
	const words = [];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * data.length);
		if (enableCapitals) {
			if (randomIndex % 3 === 0)
				words.push(
					data[randomIndex][0].toUpperCase() + data[randomIndex].slice(1)
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
