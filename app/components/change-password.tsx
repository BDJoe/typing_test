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
import { changePassword } from "@/lib/auth-client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChangePasswordSchema } from "@/utils/zod/change-password-schema";

const ChangePassword = ({
	className,
	onSubmit,
	...props
}: React.ComponentProps<"div">) => {
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof ChangePasswordSchema>>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
		mode: "onSubmit",
	});

	const handleSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
		try {
			await changePassword(
				{
					newPassword: data.newPassword,
					currentPassword: data.oldPassword,
					revokeOtherSessions: true,
				},
				{
					onResponse: () => {
						setLoading(false);
					},
					onRequest: () => {
						setLoading(true);
					},
					onSuccess: (e) => {
						toast.success("Password has been changed!");
						form.reset();
						onSubmit();
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
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Enter your old and new passwords below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id='login-form' onSubmit={form.handleSubmit(handleSubmit)}>
						<FieldGroup>
							<Controller
								name='oldPassword'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='password'>Current Password</FieldLabel>
										<Input
											{...field}
											id='oldPassword'
											aria-invalid={fieldState.invalid}
											type='password'
											placeholder='Enter current password'
											required
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name='newPassword'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
										<Input
											{...field}
											id='newPassword'
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
								name='confirmNewPassword'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='confirmNewPassword'>
											Confirm New Password
										</FieldLabel>
										<Input
											{...field}
											id='confirmNewPassword'
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
							{loading ? "Changing password..." : "Change Password"}
						</Button>
					</Field>
				</CardContent>
			</Card>
		</div>
	);
};

export default ChangePassword;
