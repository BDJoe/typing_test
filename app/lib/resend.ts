import { User } from "better-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendResetPassword(user: User, url: string) {
	await resend.emails.send({
		from: "The Typing Test <auth@jlimbert.xyz>",
		to: user.email,
		subject: "Reset your password",
		html: `Click the link to reset your password: ${url}`,
	});
}
