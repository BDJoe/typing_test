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
import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ForgotPasswordSchema } from "@/utils/zod/fogot-password-schema";

const ForgotPassword = ({
	className,
	...props
}: React.ComponentProps<"div">) => {
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
		try {
			await requestPasswordReset(
				{
					email: data.email,
					redirectTo: "/reset-password",
				},
				{
					onResponse: () => {
						setLoading(false);
					},
					onRequest: () => {
						setLoading(true);
					},
					onSuccess: () => {
						toast.success("Password reset email sent!");
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
					<CardTitle>Forgot Password</CardTitle>
					<CardDescription>
						Enter your email below to reset your password
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
						</FieldGroup>
					</form>
					<Field orientation='vertical' className='mt-5'>
						<Button type='submit' form='login-form' disabled={loading}>
							{loading ? "Sending reset email..." : "Send Reset Email"}
						</Button>
					</Field>
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPassword;
