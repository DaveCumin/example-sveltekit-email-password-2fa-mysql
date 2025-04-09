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
		<Card.Title class="mx-auto w-full text-center">Verify your email address</Card.Title>
		<Card.Description>We sent an code to {data.email}.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance>
			<Label for="form-verify.code">Code</Label>
			<Input id="form-verify.code" name="code" required />
			<Button variant="outline" type="submit">Verify</Button>
			<p>{form?.message ?? ""}</p>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
