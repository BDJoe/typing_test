import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendResetPassword } from "@/lib/resend";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		resetPasswordTokenExpiresIn: 60 * 10, // 10 minutes
		sendResetPassword: async ({ user, url }) => {
			sendResetPassword(user, url);
		},
	},
});
