<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { PageData } from "./$types";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<main>
	<h1>Hi {data.user.username}! Welcome to your dashboard.</h1>
	<form
		method="post"
		use:enhance={({ formElement, formData, action, cancel }) => {
			const loadingToast = toast.loading("Signing out...");
			return async ({ result }) => {
				if (result.type === "redirect") {
					toast.dismiss(loadingToast);
					await goto(result.location, { invalidateAll: true });
				}
				if (result.type == "failure") {
					toast.dismiss(loadingToast);
					toast.error(result.data.message);
				}
			};
		}}
	>
		<Button type="submit">Sign out</Button>
	</form>
</main>
