import { totpBucket } from "$lib/server/2fa";
import { fail, redirect } from "@sveltejs/kit";
import { getUserTOTPKey } from "$lib/server/user";
import { verifyTOTP } from "@oslojs/otp";
import { setSessionAs2FAVerified } from "$lib/server/session";
import { base } from "$app/paths";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

import type { Actions, RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, `${base}/login`);
	}
	if (!event.locals.user.registered2FA) {
		return redirect(302, `${base}/2fa/setup`);
	}
	if (event.locals.session.twoFactorVerified) {
		return redirect(302, `${base}/dashboard`);
	}
	return { user: event.locals.user };
}

export const actions: Actions = {
	verify: verify,
	signout: signout
};

async function signout(event: RequestEvent) {
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, `${base}/login`);
}

async function verify(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}
	if (!totpBucket.check(event.locals.user.id, 1)) {
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
			message: "Enter your code"
		});
	}
	if (!totpBucket.consume(event.locals.user.id, 1)) {
		return fail(429, {
			message: "Too many requests"
		});
	}

	const totpKey = await getUserTOTPKey(event.locals.user.id);

	if (totpKey === null) {
		return fail(403, {
			message: "Forbidden"
		});
	}

	if (!verifyTOTP(totpKey, 30, 6, code)) {
		return fail(400, {
			message: "Invalid code"
		});
	}
	totpBucket.reset(event.locals.user.id);

	await setSessionAs2FAVerified(event.locals.session.id);

	return { user: event.locals.user };
}
