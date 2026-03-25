import PasswordResetEmail from "@/components/password-reset-email";
import { User } from "better-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendResetPassword(user: User, url: string) {
	void resend.emails.send({
		from: process.env.EMAIL_FROM!,
		to: [user.email],
		subject: "Reset your password",
		react: PasswordResetEmail({ resetUrl: url }),
	});
}
