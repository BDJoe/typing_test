"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";

export function StatsChart({ results }) {
	results.sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
	);
	const chartData = results.map((stat) => ({
		date:
			new Date(stat.timestamp).toLocaleDateString("en-US", {
				month: "short",
				day: "2-digit",
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
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Test History</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='h-[200px] w-full'>
					<AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
						<defs>
							<linearGradient id='fillWPM' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor='var(--color-WPM)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--color-WPM)'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							tickMargin={8}
							axisLine={false}
							minTickGap={64}
							interval='preserveStartEnd'
							padding={{ left: 5, right: 5 }}
							tickFormatter={(value) => value.slice(0, 6)}
						/>

						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Area
							dataKey='WPM'
							type='natural'
							fill='url(#fillWPM)'
							fillOpacity={0.4}
							stroke='var(--color-WPM)'
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
export default StatsChart;
