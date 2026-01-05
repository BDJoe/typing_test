import { z } from "zod";

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(20, "Password must be at most 20 characters."),
		confirmPassword: z
			.string()
			.min(8, "Please confirm your password.")
			.max(20, "Password must be at most 20 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});
