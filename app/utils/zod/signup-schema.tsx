import { z } from "zod";

export const SignupSchema = z
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
