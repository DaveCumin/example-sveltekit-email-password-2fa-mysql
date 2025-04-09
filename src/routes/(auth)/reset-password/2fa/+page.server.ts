import { verifyTOTP } from "@oslojs/otp";
import { getUserTOTPKey } from "$lib/server/user";
import { validatePasswordResetSessionRequest, setPasswordResetSessionAs2FAVerified } from "$lib/server/password-reset";
import { totpBucket } from "$lib/server/2fa";
import { fail, redirect } from "@sveltejs/kit";
import { resetUser2FAWithRecoveryCode } from "$lib/server/2fa";
import { recoveryCodeBucket } from "$lib/server/2fa";
import { base } from "$app/paths";
import type { Actions, RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
	const { session, user } = await validatePasswordResetSessionRequest(event);

	if (session === null) {
		return redirect(302, `${base}/fauth/orgot-password`);
	}
	if (!session.emailVerified) {
		return redirect(302, `${base}/reset-password/verify-email`);
	}
	if (!user.registered2FA) {
		return redirect(302, `${base}/reset-password`);
	}
	if (session.twoFactorVerified) {
		return redirect(302, `${base}/reset-password`);
	}
	return {};
}

export const actions: Actions = {
	totp: totpAction,
	recovery_code: recoveryCodeAction
};

async function totpAction(event: RequestEvent) {
	const { session, user } = await validatePasswordResetSessionRequest(event);
	if (session === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}
	if (!session.emailVerified || !user.registered2FA || session.twoFactorVerified) {
		return fail(403, {
			message: "Forbidden"
		});
	}
	if (!totpBucket.check(session.userId, 1)) {
		return fail(429, {
			message: "Too many requests"
		});
	}

	const formData = await event.request.formData();
	const code = formData.get("code");
	if (typeof code !== "string") {
		return fail(400, {
			message: "Invalid or missing fields"
		});
	}
	if (code === "") {
		return fail(400, {
			message: "Please enter your code"
		});
	}
	const totpKey = await getUserTOTPKey(session.userId);
	if (totpKey === null) {
		return fail(403, {
			message: "Forbidden"
		});
	}
	if (!totpBucket.consume(session.userId, 1)) {
		return fail(429, {
			message: "Too many requests"
		});
	}
	if (!verifyTOTP(totpKey, 30, 6, code)) {
		return fail(400, {
			message: "Invalid code"
		});
	}
	totpBucket.reset(session.userId);
	await setPasswordResetSessionAs2FAVerified(session.id);
	return redirect(302, `${base}/reset-password`);
}

async function recoveryCodeAction(event: RequestEvent) {
	const { session, user } = await validatePasswordResetSessionRequest(event);
	if (session === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}
	if (!session.emailVerified || !user.registered2FA || session.twoFactorVerified) {
		return fail(403, {
			message: "Forbidden"
		});
	}

	if (!recoveryCodeBucket.check(session.userId, 1)) {
		return fail(429, {
			message: "Too many requests"
		});
	}

	const formData = await event.request.formData();
	const code = formData.get("code");
	if (typeof code !== "string") {
		return fail(400, {
			message: "Invalid or missing fields"
		});
	}
	if (code === "") {
		return fail(400, {
			message: "Please enter your code"
		});
	}
	if (!recoveryCodeBucket.consume(session.userId, 1)) {
		return fail(429, {
			message: "Too many requests"
		});
	}
	const valid = await resetUser2FAWithRecoveryCode(session.userId, code);
	if (!valid) {
		return fail(400, {
			message: "Invalid code"
		});
	}
	recoveryCodeBucket.reset(session.userId);
	return redirect(302, `${base}/reset-password`);
}
