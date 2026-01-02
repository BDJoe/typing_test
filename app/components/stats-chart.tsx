"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { getResults } from "@/utils/server/actions";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export function StatsChart() {
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
				data.sort(
					(a, b) =>
						new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
				);
				setResults(data);
			}
		};
		fetchResults();
	}, [session]);

	const chartData = results.map((stat) => ({
		date:
			new Date(stat.timestamp).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}) +
			" " +
			new Date(stat.timestamp).toLocaleString("en-US", {
				timeStyle: "short",
			}),
		WPM: stat.wpm,
		accuracy: stat.accuracy,
	}));

	const chartConfig = {
		WPM: {
			label: "WPM",
			color: "var(--chart-1)",
		},
		accuracy: {
			label: "Accuracy",
			color: "var(--chart-2)",
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Test History</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='min-h-100 w-full'>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={true}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) =>
								value.split(" ")[0] + " " + value.split(" ")[1]
							}
						/>

						<ChartTooltip
							content={<ChartTooltipContent />}
							wrapperStyle={{
								backgroundColor: "white",
								borderRadius: 10,
							}}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Bar dataKey='WPM' stackId='a' fill='var(--color-WPM)' radius={4} />
						<Bar
							dataKey='accuracy'
							stackId='b'
							fill='var(--color-accuracy)'
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
export default StatsChart;
