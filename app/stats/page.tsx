import { getResults } from "@/utils/server/actions";

const page = async () => {
	const results = await getResults();

	return (
		<div className='flex items-center justify-center min-w-screen min-h-screen max-md:py-8 max-md:px-6 max-md:m-4 font-mono p-20 leading-[1.6]'>
			{results.map((result, index) => (
				<div
					key={index}
					className='border border-gray-300 rounded-lg p-6 mb-6 w-full max-w-md shadow-md'
				>
					<h2 className='text-2xl font-bold mb-4'>Test #{index + 1}</h2>
					<p className='mb-2'>
						<strong>WPM:</strong> {result.wpm}
					</p>
					<p className='mb-2'>
						<strong>Accuracy:</strong> {result.accuracy}%
					</p>
					<p className='mb-2'>
						<strong>Total Characters:</strong> {result.totalChars}
					</p>
					<p className='mb-2'>
						<strong>Game Mode:</strong> {result.gameConfig.gameMode}
					</p>
					{result.gameConfig.gameMode === "words" && (
						<p className='mb-2'>
							<strong>Round Time:</strong> {result.gameConfig.roundTime} seconds
						</p>
					)}
					{result.gameConfig.gameMode === "quote" && (
						<p className='mb-2'>
							<strong>Time Elapsed:</strong> {result.timeElapsed * 60} seconds
						</p>
					)}
					<p className='mb-2'>
						<strong>Timestamp:</strong>{" "}
						{new Date(result.timestamp).toLocaleString()}
					</p>
					<p className='mt-4'>
						<strong>Text:</strong> {result.text}
					</p>
				</div>
			))}
		</div>
	);
};

export default page;
