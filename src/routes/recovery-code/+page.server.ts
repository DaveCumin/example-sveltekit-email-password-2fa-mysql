import { getUserRecoverCode } from "$lib/server/user";
import { redirect } from "@sveltejs/kit";
import { base } from "$app/paths";

import type { RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, `${base}/login`);
	}
	if (!event.locals.user.emailVerified) {
		return redirect(302, `${base}/verify-email`);
	}
	if (!event.locals.user.registered2FA) {
		return redirect(302, `${base}/2fa/setup`);
	}
	if (!event.locals.session.twoFactorVerified) {
		return redirect(302, `${base}/2fa`);
	}
	const recoveryCode = await getUserRecoverCode(event.locals.user.id);
	return {
		recoveryCode
	};
}
