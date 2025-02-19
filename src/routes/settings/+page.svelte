<script lang="ts">
	import { enhance } from "$app/forms";

	import type { PageData, ActionData } from "./$types";

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
</header>
<main>
	<h1>Settings</h1>
	<section>
		<h2>Update email</h2>
		<p>Your email: {data.user.email}</p>
	</section>
	<section>
		<h2>Update password</h2>
		<form method="post" use:enhance action="?/password">
			<label for="form-password.password">Current password</label>
			<input type="password" id="form-email.password" name="password" autocomplete="current-password" required /><br />
			<label for="form-password.new-password">New password</label>
			<input
				type="password"
				id="form-password.new-password"
				name="new_password"
				autocomplete="new-password"
				required
			/><br />
			<button>Update</button>
			<p>{form?.password?.message ?? ""}</p>
		</form>
	</section>
	{#if data.user.registered2FA}
		<section>
			<h2>Update two-factor authentication</h2>
			<a href="/2fa/setup">Update</a>
		</section>
	{/if}
	{#if data.recoveryCode !== null}
		<section>
			<h1>Recovery code</h1>
			<p>Your recovery code is: {data.recoveryCode}</p>
		</section>
	{/if}
</main>
