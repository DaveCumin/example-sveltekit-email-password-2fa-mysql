<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
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
		<Card.Description>We sent a verificaiton code to {data.email}.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance action="?/verify">
			<Label for="form-verify.code">Code</Label>
			<Input id="form-verify.code" name="code" required />
			<Button class="mt-3" type="submit">Verify</Button>
			<p>{form?.verify?.message ?? ""}</p>
		</form>
		<div class="relative float-right mt-[-2.5rem]">
			<form method="post" use:enhance action="?/resend">
				<Button variant="outline" type="submit">Resend code</Button>
				<p>{form?.resend?.message ?? ""}</p>
			</form>
		</div>
	</Card.Content>
</Card.Root>
