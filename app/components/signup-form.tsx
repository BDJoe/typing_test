"use client";
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
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const formSchema = z
	.object({
		name: z.string().min(1, "Name is required."),
		email: z.email("Please enter a valid email address."),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(100, "Password must be at most 100 characters."),
		confirmPassword: z.string().min(8, "Please confirm your password."),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "Passwords do not match.",
				path: ["confirmPassword"],
			});
		}
	});

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setLoading(true);

		const res = await signUp.email({
			name: data.name,
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
			router.push("/dashboard");
		}
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id='signup-form' onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name='name'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='name'>Name</FieldLabel>
									<Input
										{...field}
										id='name'
										type='text'
										aria-invalid={fieldState.invalid}
										placeholder='John Doe'
										required
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name='email'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='email'>Email</FieldLabel>
									<Input
										{...field}
										id='email'
										type='email'
										aria-invalid={fieldState.invalid}
										placeholder='m@example.com'
										required
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									<FieldDescription>
										We&apos;ll use this to contact you. We will not share your
										email with anyone else.
									</FieldDescription>
								</Field>
							)}
						/>
						<Controller
							name='password'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='password'>Password</FieldLabel>
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
						<Controller
							name='confirmPassword'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='confirm-password'>
										Confirm Password
									</FieldLabel>
									<Input
										{...field}
										id='confirm-password'
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
						<FieldGroup>
							<Field>
								<Button type='submit' form='signup-form' disabled={loading}>
									{loading ? "Signing up..." : "Sign Up"}
								</Button>
								<Button variant='outline' type='button' disabled={loading}>
									Sign up with Google
								</Button>
								<FieldDescription className='px-6 text-center'>
									Already have an account? <Link href='/sign-in'>Sign in</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
