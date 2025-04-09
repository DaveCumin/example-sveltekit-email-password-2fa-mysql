<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

	import type { PageData, ActionData } from "./$types";

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	function updateAuth() {
		goto(`${base}/2fa/setup`);
	}
</script>

<main>
	<h1>Settings</h1>
	<section>
		<h2>Update password</h2>
		<form method="post" use:enhance action="?/password">
			<Label for="form-password.password">Current password</Label>
			<Input type="password" id="form-email.password" name="password" autocomplete="current-password" required /><br />
			<Label for="form-password.new-password">New password</Label>
			<Input
				type="password"
				id="form-password.new-password"
				name="new_password"
				autocomplete="new-password"
				required
			/><br />
			<Button type="submit">Update</Button>
			<p>{form?.password?.message ?? ""}</p>
		</form>
	</section>
	{#if data.user.registered2FA}
		<section>
			<h2>Update two-factor authentication</h2>
			<Button onclick={updateAuth}>Update</Button>
		</section>
	{/if}
	{#if data.recoveryCode !== null}
		<section>
			<h1>Recovery code</h1>
			<p>Your recovery code is: {data.recoveryCode}</p>
		</section>
	{/if}
</main>
