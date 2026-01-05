import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getResults } from "@/utils/server/actions";
import {
	useReactTable,
	getCoreRowModel,
	ColumnDef,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<TData, TValue>[] = [
	{
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		accessorKey: "timestamp",
		cell: ({ getValue }) => {
			const date = new Date(getValue<string>());
			return (
				date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				}) +
				" " +
				date.toLocaleTimeString("en-US", { timeStyle: "short" })
			);
		},
		sortDescFirst: true,
	},
	{ header: "WPM", accessorKey: "wpm" },
	{
		header: "Accuracy",
		accessorKey: "accuracy",
		cell: ({ getValue }) => getValue<number>().toString() + "%",
	},
	{
		header: "Time Elapsed (s)",
		accessorKey: "timeElapsed",
		cell: ({ getValue }) => getValue<number>().toString() + "s",
	},
	{ header: "Total Characters", accessorKey: "totalChars" },
];

interface Props {
	results: TData[];
}

const StatsTable = ({ results }: Props) => {
	results.sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data: results,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	return (
		<div>
			<div className='overflow-hidden rounded-md border'>
				<Table className='max-h-2 overflow-hidden'>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default StatsTable;
