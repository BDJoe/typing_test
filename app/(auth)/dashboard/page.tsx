"use client";

import ChangePassword from "@/components/change-password";
import DeleteAccount from "@/components/delete-account";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardPage = () => {
	const router = useRouter();
	const { data: session, isPending } = useSession();

	useEffect(() => {
		if (!isPending && !session?.user) {
			router.push("/sign-in");
		}
	}, [isPending, session, router]);

	if (isPending)
		return (
			<p className='max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4'>
				Loading...
			</p>
		);
	if (!session?.user)
		return (
			<p className='max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4'>
				Redirecting...
			</p>
		);

	const { user } = session;

	return (
		<div className='max-w-md h-screen flex items-center justify-top flex-col mx-auto p-6 space-y-4'>
			<h1 className='text-2xl font-bold'>Dashboard</h1>
			<p>Welcome, {user.name || "User"}!</p>
			<p>Email: {user.email}</p>
			<ChangePassword />
			<DeleteAccount />
		</div>
	);
};

export default DashboardPage;
