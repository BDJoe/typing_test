"use client";

import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignInPage = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);

		const res = await signIn.email({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});

		if (res.error) {
			setError(res.error.message || "Something went wrong");
		} else {
			router.push("/dashboard");
		}
	};

	return (
		<div className='max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4'>
			<h1 className='text-2xl font-bold'>Sign In</h1>

			{error && <p className='text-red-500'>{error}</p>}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<input
					name='email'
					type='email'
					placeholder='Email'
					required
					className='w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2'
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					required
					className='w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2'
				/>
				<button
					type='submit'
					className='w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200'
				>
					Sign In
				</button>
				<p>
					New User?{" "}
					<Link href='/sign-up' className='text-yellow-500 hover:underline'>
						Sign Up
					</Link>
				</p>
			</form>
		</div>
	);
};

export default SignInPage;
