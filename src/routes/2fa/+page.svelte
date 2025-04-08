<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";

	import type { ActionData } from "./$types";

	interface Props {
		form: ActionData;
		data: PageData;
	}

	let { form, data }: Props = $props();
</script>

<h1>Two-factor authentication</h1>
<p>{data.user.username}, please enter the code from your authenticator app.</p>
<form method="post" use:enhance>
	<label for="form-totp.code">Code</label>
	<input id="form-totp.code" name="code" autocomplete="one-time-code" required /><br />
	<button>Verify</button>
	<p>{form?.message ?? ""}</p>
</form>
<a href={`${base}/2fa/reset`}>Use recovery code</a>
