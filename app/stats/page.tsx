"use client";
import { useSession } from "@/lib/auth-client";
import { getResults } from "@/utils/server/actions";
import Link from "next/link";
import { useEffect, useState } from "react";

const StatsPage = () => {
	const { data: session } = useSession();
	const [results, setResults] = useState<
		Array<{
			wpm: number;
			accuracy: number;
			totalChars: number;
			timeElapsed: number;
			text: string;
			timestamp: string;
		}>
	>([]);

	useEffect(() => {
		const fetchResults = async () => {
			if (session?.user.id) {
				const data = await getResults(session.user.id);
				setResults(data);
			}
		};
		fetchResults();
	}, [session]);

	if (!session) {
		return (
			<div className='max-w-md h-screen flex items-center justify-center mx-auto p-6 space-y-4'>
				<p>
					Please{" "}
					<Link href='/sign-in' className='font-bold text-yellow-500'>
						sign in
					</Link>{" "}
					to view your stats.
				</p>
			</div>
		);
	}
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
						<strong>Time Elapsed:</strong> {result.timeElapsed} seconds
					</p>
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

export default StatsPage;
