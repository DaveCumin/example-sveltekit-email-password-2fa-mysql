import { redirect } from "@sveltejs/kit";
import { base } from "$app/paths";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

import type { Actions, RequestEvent } from "./$types";

export const actions: Actions = {
	default: signout
};

async function signout(event: RequestEvent) {
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, `${base}/`);
}
