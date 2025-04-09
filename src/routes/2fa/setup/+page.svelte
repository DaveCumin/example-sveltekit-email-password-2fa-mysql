<script lang="ts">
	import { enhance } from "$app/forms";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { ActionData, PageData } from "./$types";

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<Card.Root class="mx-auto mt-10 w-[350px]">
	<Card.Header>
		<Card.Title class="mx-auto w-full text-center">Set up two-factor authentication</Card.Title>
	</Card.Header>
	<Card.Content>
		<div style="width:200px; height: 200px;">
			{@html data.qrcode}
		</div>
		<form method="post" use:enhance>
			<Input name="key" value={data.encodedTOTPKey} hidden required />
			<Label for="form-totp.code">Verify the code from the app</Label>
			<Input id="form-totp.code" name="code" required /><br />
			<Button type="submit">Save</Button>
			<p>{form?.message ?? ""}</p>
		</form>
	</Card.Content>
</Card.Root>
