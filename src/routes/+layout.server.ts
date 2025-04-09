import type { PageServerLoadEvent } from "./$types";

export function load(event: PageServerLoadEvent) {
	return {
		user: event.locals.user,
		session: event.locals.session
	};
}
