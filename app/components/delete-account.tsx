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
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { deleteUser } from "@/lib/auth-client";
import router from "next/router";

const DeleteAccount = () => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const passwordSchema = z.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(20, "Password must be at most 20 characters."),
	});

	const form = useForm<z.infer<typeof passwordSchema>>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			password: "",
		},
		mode: "onSubmit",
	});

	const handleSubmit = async (data: z.infer<typeof passwordSchema>) => {
		setLoading(true);

		const res = await deleteUser({
			password: data.password,
			callbackURL: "/",
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
			form.reset();
			setOpen(false);
			toast.success("Account deleted!");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				form.reset();
			}}
		>
			<form id='delete-account-form' onSubmit={form.handleSubmit(handleSubmit)}>
				<DialogTrigger asChild>
					<Button variant='destructive'>Delete Account</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Account</DialogTitle>
						<DialogDescription className='font-bold text-red-400'>
							WARNING
							<br />
							This will permanently delete your account and all related data!
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Controller
							name='password'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='password'>Current Password</FieldLabel>
									<Input
										{...field}
										id='password'
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
					</FieldGroup>
					<DialogFooter>
						<Field orientation='vertical' className='mt-5'>
							<DialogClose asChild>
								<Button variant='outline'>Cancel</Button>
							</DialogClose>
							<Button
								type='submit'
								variant='destructive'
								form='delete-account-form'
								disabled={loading}
							>
								{loading ? "Deleting account..." : "Submit"}
							</Button>
						</Field>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export default DeleteAccount;
