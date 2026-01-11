"use client";
import {
	Area,
	AreaChart,
	Bar,
	CartesianGrid,
	ComposedChart,
	ReferenceLine,
	Scatter,
	XAxis,
	YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { RoundResult } from "@/lib/types/types";

interface Props {
	result: RoundResult;
}

const RoundChart = ({ result }: Props) => {
	const filteredResult = result.roundTimePerSecond.map((time, idx) => {
		return {
			time,
			WPM: result.wpmPerSecond[idx],
			errors: result.errorsPerSecond[idx],
		};
	});
	const chartData = filteredResult;

	const chartConfig = {
		WPM: {
			label: "WPM",
			color: "var(--chart-2)",
		},
		errors: { label: "Errors", color: "var(--chart-1)" },
	} satisfies ChartConfig;

	return (
		<Card className='mt-5'>
			<CardHeader>
				<CardTitle>
					{result.timestamp.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					}) +
						" " +
						result.timestamp.toLocaleTimeString("en-US", {
							timeStyle: "short",
						})}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='h-[200px] w-full'>
					<ComposedChart data={chartData} margin={{ left: 6, right: 6 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='time'
							tickLine={false}
							tickMargin={8}
							axisLine={false}
							name='Time'
						/>
						<YAxis
							yAxisId={"b"}
							y={1}
							dataKey={"errors"}
							hide
							orientation='right'
						/>
						<YAxis yAxisId={"a"} dataKey={"WPM"} hide orientation='left' />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='line' hideLabel />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Area
							yAxisId={"a"}
							dataKey='WPM'
							type='natural'
							fill='var(--color-WPM)'
							fillOpacity={0.6}
							stroke='var(--color-WPM)'
						/>

						<Bar
							yAxisId={"b"}
							dataKey='errors'
							type='bump'
							fill='var(--color-errors)'
							fillOpacity={0.8}
							stroke='var(--color-errors)'
							radius={[10, 10, 0, 0]}
							barSize={5}
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default RoundChart;
