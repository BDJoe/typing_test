"use client";
import StatsChart from "@/components/stats-chart";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

const StatsPage = () => {
	const { data: session } = useSession();

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
		<div className='flex items-center justify-center min-w-screen min-h-screen max-md:py-8 max-md:px-6 max-md:m-4 p-20 leading-[1.6]'>
			<StatsChart />
		</div>
	);
};

export default StatsPage;
