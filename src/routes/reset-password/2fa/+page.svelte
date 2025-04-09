<script lang="ts">
	import { enhance } from "$app/forms";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { ActionData } from "./$types";

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<h1>Two-factor authentication</h1>
<p>Enter the code from your authenticator app.</p>
<form method="post" use:enhance action="?/totp">
	<Label for="form-totp.code">Code</Label>
	<Input id="form-totp.code" name="code" required /><br />
	<Button type="submit">Verify code</Button>
	<p>{form?.totp?.message ?? ""}</p>
</form>
<section>
	<h2>Use your recovery code instead</h2>
	<form method="post" use:enhance action="?/recovery_code">
		<Label for="form-recovery-code.code">Recovery code</Label>
		<Input id="form-recovery-code.code" name="code" required /><br />
		<Button type="submit">Verify code</Button>
		<p>{form?.recoveryCode?.message ?? ""}</p>
	</form>
</section>
