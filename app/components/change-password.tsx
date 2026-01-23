"use client";
import { Button } from "@/components/ui/button";
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
import { ChangePasswordSchema } from "@/lib/zod/change-password-schema";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ChangePassword = ({ open, setOpen }: Props) => {
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
						setOpen(false);
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
				},
			);
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				setOpen(false);
				form.reset();
			}}
		>
			<form
				id='change-password-form'
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Password</DialogTitle>
					</DialogHeader>
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
					<DialogFooter>
						<Field orientation='vertical' className='mt-5'>
							<DialogClose asChild>
								<Button variant='outline'>Cancel</Button>
							</DialogClose>
							<Button
								type='submit'
								form='change-password-form'
								disabled={loading}
							>
								{loading ? "Changing password..." : "Submit"}
							</Button>
						</Field>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export default ChangePassword;
