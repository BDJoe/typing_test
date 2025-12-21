import data from "@/data/wordlist.json";

export const getRandomWords = (count) => {
	const words = [];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * data.length);
		if (randomIndex % 3 === 0)
			words.push(
				data[randomIndex][0].toUpperCase() + data[randomIndex].slice(1)
			);
		else words.push(data[randomIndex]);
	}

	return words.join(" ");
};
