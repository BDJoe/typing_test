"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
	const pathname = usePathname();
	return (
		<div className='absolute flex w-full h-20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] items-center  bg-gray-800'>
			<div className='text-white font-sans text-2xl font-bold p-10 w-[20%]'>
				Typing Test
			</div>
			<div className='w-[60%] flex justify-center items-center gap-4'>
				<Link
					href='/'
					className={`font-sans text-2xl p-2 ${
						pathname === "/" ? "bg-amber-300 rounded-2xl text-black" : ""
					}`}
				>
					Home
				</Link>
				<Link
					href='/stats'
					className={`font-sans text-2xl p-2 ${
						pathname === "/stats" ? "bg-amber-300 rounded-2xl text-black" : ""
					}`}
				>
					Stats
				</Link>
				<Link
					href='/account'
					className={`font-sans text-2xl p-2 ${
						pathname === "/account" ? "bg-amber-300 rounded-2xl text-black" : ""
					}`}
				>
					Account
				</Link>
			</div>
		</div>
	);
};

export default Header;
