<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";

	import type { ActionData } from "./$types";
	import { goto } from "$app/navigation";

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let acceptTerms = $state(false);
</script>

<Card.Root class="mx-auto mt-10 w-[350px]">
	<Card.Header>
		<Card.Title class="mx-auto w-full text-center">Create an account</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance>
			<Label for="form-signup.username">Username</Label>
			<Input
				id="form-signup.username"
				name="username"
				required
				value={form?.username ?? ""}
				minlength="4"
				maxlength="31"
			/>
			<Label for="form-signup.email">Email</Label>
			<Input
				type="email"
				id="form-signup.email"
				name="email"
				autocomplete="username"
				required
				value={form?.email ?? ""}
			/>
			<Label for="form-signup.password">Password</Label>
			<Input type="password" id="form-signup.password" name="password" autocomplete="new-password" required />
			<Input class="hidden" id="form-signup.acceptTerms" name="acceptTerms" bind:value={acceptTerms} />
			<div class="items-top mt-2 flex space-x-2">
				<Checkbox id="terms1" bind:checked={acceptTerms} />
				<div class="grid gap-1.5 leading-none">
					<Label
						for="terms1"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Accept terms and conditions
					</Label>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button type="submit">Continue</Button>
		<Button variant="outline" onclick={() => goto(base)}>Cancel</Button>
		<p>{form?.message ?? ""}</p>
	</Card.Footer>
</Card.Root>
