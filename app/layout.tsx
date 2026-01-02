import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Header from "./components/header";
import { Toaster } from "./components/ui/sonner";
config.autoAddCss = false;

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Typing Test",
	description: "A modern typing test built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistMono.variable} ${geistSans.variable} antialiased m-0 p-0 dark`}
			>
				<div className='min-h-screen min-w-screen bg-background text-foreground'>
					<Header />
					{children}
				</div>
				<Toaster
					position='top-center'
					toastOptions={{
						style: {
							backgroundColor: "#242323",
							color: "white",
						},
					}}
				/>
			</body>
		</html>
	);
}
