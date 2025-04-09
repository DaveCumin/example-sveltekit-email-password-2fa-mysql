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

<Card.Root class="mx-auto mt-10 w-[350px]">
	<Card.Header>
		<Card.Title class="mx-auto w-full text-center">Enter your new password</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance>
			<Label for="form-reset.password">Password</Label>
			<Input type="password" id="form-reset.password" name="password" autocomplete="new-password" required /><br />
			<Button type="submit">Reset password</Button>
			<p>{form?.message ?? ""}</p>
		</form>
	</Card.Content>
</Card.Root>
