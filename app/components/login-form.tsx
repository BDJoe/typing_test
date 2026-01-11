"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoginSchema } from "@/lib/zod/login-schema";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		setLoading(true);
		const res = await signIn.email({
			email: data.email,
			password: data.password,
		});

		if (res.error) {
			toast.error(res.error.message || "Something went wrong", {
				duration: 4000,
				style: {
					color: "red",
				},
			});
			setLoading(false);
		} else {
			setLoading(false);
			router.push("/");
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id='login-form' onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name='email'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='email'>Email</FieldLabel>
										<Input
											{...field}
											id='email'
											aria-invalid={fieldState.invalid}
											type='email'
											placeholder='m@example.com'
											required
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name='password'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<div className='flex items-center'>
											<FieldLabel htmlFor='password'>Password</FieldLabel>
											<Link
												href='/forgot-password'
												className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
											>
												Forgot your password?
											</Link>
										</div>
										<Input
											{...field}
											id='password'
											type='password'
											aria-invalid={fieldState.invalid}
											required
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
					<Field orientation='vertical' className='mt-5'>
						<Button type='submit' form='login-form' disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</Button>
						<FieldDescription className='text-center'>
							Don&apos;t have an account? <Link href='/sign-up'>Sign up</Link>
						</FieldDescription>
					</Field>
				</CardContent>
			</Card>
		</div>
	);
}
