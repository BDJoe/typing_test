import { z } from "zod";

export const ChangePasswordSchema = z
	.object({
		oldPassword: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(20, "Password must be at most 20 characters."),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(20, "Password must be at most 20 characters."),
		confirmNewPassword: z
			.string()
			.min(8, "Please confirm your password.")
			.max(20, "Password must be at most 20 characters."),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match.",
		path: ["confirmNewPassword"],
	});
