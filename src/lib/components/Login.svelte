<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { ActionData } from "./$types";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<Card.Root class="mx-auto mt-10 w-[350px]">
	<Card.Header>
		<Card.Title class="mx-auto w-full text-center">Sign in</Card.Title>
	</Card.Header>
	<Card.Content>
		<form
			method="post"
			action={`${base}/login/`}
			use:enhance={({ formElement, formData, action, cancel }) => {
				const loadingToast = toast.loading("Verifying credentials...");
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
			<Label for="form-login.email">Email</Label>
			<Input
				type="email"
				id="form-login.email"
				name="email"
				autocomplete="username"
				required
				value={form?.email ?? ""}
			/>
			<Label for="form-login.password">Password</Label>
			<Input type="password" id="form-login.password" name="password" autocomplete="current-password" required />
			<Button class="mb-3 mt-3 w-full" type="submit" formaction="?/login">Log in</Button>

			<p>{form?.message ?? ""}</p>
			<a href={`${base}/forgot-password`}>Forgot password?</a>
		</form>
	</Card.Content>
</Card.Root>
