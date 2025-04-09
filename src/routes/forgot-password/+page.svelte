<script lang="ts">
	import { enhance } from "$app/forms";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import type { ActionData } from "./$types";

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<Card.Root class="mx-auto mt-10 w-[350px]">
	<Card.Header>
		<Card.Title class="mx-auto w-full text-center">Forgot your password?</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance>
			<Label for="form-forgot.email">Email</Label>
			<Input type="email" id="form-forgot.email" name="email" required value={form?.email ?? ""} />
		</form>
	</Card.Content>
	<Card.Footer class="block ">
		<div class="flex justify-between">
			<Button>Reset password</Button>
			<Button variant="outline" onclick={() => goto(base)}>Cancel</Button>
		</div>
		<p>{form?.message ?? ""}</p>
	</Card.Footer>
</Card.Root>
