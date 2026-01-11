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
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/auth-client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ResetPasswordSchema } from "@/lib/zod/reset-password-schema";

const ResetPassword = ({
	className,
	...props
}: React.ComponentProps<"div">) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
		try {
			await resetPassword(
				{
					newPassword: data.password,
					token:
						typeof window !== "undefined"
							? new URLSearchParams(window.location.search).get("token") || ""
							: "",
				},
				{
					onResponse: () => {
						setLoading(false);
					},
					onRequest: () => {
						setLoading(true);
					},
					onSuccess: () => {
						toast.success("Password has been reset!");
						router.replace("/sign-in");
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
				}
			);
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>Enter a new password below</CardDescription>
				</CardHeader>
				<CardContent>
					<form id='login-form' onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name='password'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='password'>Password</FieldLabel>
										<Input
											{...field}
											id='password'
											aria-invalid={fieldState.invalid}
											type='password'
											placeholder='Enter new password'
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
										<FieldLabel htmlFor='confirmPassword'>
											Confirm Password
										</FieldLabel>
										<Input
											{...field}
											id='confirmPassword'
											aria-invalid={fieldState.invalid}
											type='password'
											placeholder='Confirm new password'
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
							{loading ? "Resetting password..." : "Reset Password"}
						</Button>
					</Field>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPassword;
