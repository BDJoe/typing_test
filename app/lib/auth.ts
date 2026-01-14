import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendResetPassword } from "@/lib/resend";

export const auth = betterAuth({
	trustedOrigins: ["http://192.168.0.173:3000"],
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
	user: {
		deleteUser: {
			enabled: true,
		},
	},
});
