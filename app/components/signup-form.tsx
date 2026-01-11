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
import { SignupSchema } from "@/lib/zod/signup-schema";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof SignupSchema>>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
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
			router.push("/");
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
