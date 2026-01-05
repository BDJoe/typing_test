"use client";
import StatsChart from "@/components/stats-chart";
import { useSession } from "@/lib/auth-client";
import StatsTable from "@/components/stats-table";
import Link from "next/link";
import StatCard from "@/components/stat-card";
import { useEffect, useState } from "react";
import { getResults } from "@/utils/server/actions";
import Loading from "@/utils/loading";
import { set } from "zod";

const StatsPage = () => {
	const { data: session, isPending } = useSession();
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
	const [averageAccuracy, setAverageAccuracy] = useState(0);
	const [averageWPM, setAverageWPM] = useState(0);
	const [totalTests, setTotalTests] = useState(0);

	useEffect(() => {
		const fetchResults = async () => {
			if (session?.user.id) {
				const data = await getResults(session.user.id);
				setAverageWPM(
					data.reduce((acc, curr) => acc + curr.wpm, 0) / data.length || 0
				);
				setAverageAccuracy(
					data.reduce((acc, curr) => acc + curr.accuracy, 0) / data.length || 0
				);
				setTotalTests(data.length);
				setResults(data);
			}
		};
		fetchResults();
	}, [session]);

	if (!session && !isPending) {
		return (
			<div className='max-w-md h-screen flex items-center justify-center mx-auto p-6 space-y-4'>
				<p>
					Please{" "}
					<Link href='/sign-in' className='font-bold text-primary'>
						sign in
					</Link>{" "}
					to view your stats.
				</p>
			</div>
		);
	}

	if (isPending) {
		return <Loading />;
	}

	return (
		<div className='grid grid-cols-1 px-10 items-center justify-center mt-5 max-w-full'>
			<StatsChart results={results} />
			<div className='flex items-center justify-center gap-5 my-5'>
				<StatCard
					icon='fa-solid fa-file-lines'
					label='Total Tests Taken'
					value={totalTests}
				/>
				<StatCard
					icon='fa-solid fa-trophy'
					label='Best WPM'
					value={
						results.length > 0
							? Math.max(...results.map((result) => result.wpm)).toFixed(0)
							: 0
					}
				/>
				<StatCard
					icon='fa-solid fa-keyboard'
					label='Average WPM'
					value={averageWPM.toFixed(0)}
				/>
				<StatCard
					icon='fa-solid fa-bullseye'
					label='Average Accuracy'
					value={averageAccuracy}
				/>
			</div>
			<StatsTable results={results} />
		</div>
	);
};

export default StatsPage;
