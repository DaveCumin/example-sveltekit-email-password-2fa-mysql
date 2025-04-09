<script lang="ts">
	import { enhance } from "$app/forms";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import type { ActionData } from "./$types";
	import { toast } from "svelte-sonner";

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
		<form
			method="post"
			use:enhance={({ formElement, formData, action, cancel }) => {
				return async ({ result }) => {
					const loadingToast = toast.loading("Checking details...");
					if (result.type === "redirect") {
						toast.dismiss(loadingToast);
						await goto(result.location, { invalidateAll: true });
					}
					if (result.type == "failure") {
						toast.dismiss(loadingToast);
						toast.error(result.data.message);
					}
				};
			}}
		>
			<Label for="form-forgot.email">Email</Label>
			<Input type="email" id="form-forgot.email" name="email" required value={form?.email ?? ""} />
			<div class="mt-2 flex justify-between">
				<Button type="submit">Reset password</Button>
				<Button variant="outline" onclick={() => goto(base)}>Cancel</Button>
			</div>
			<p>{form?.message ?? ""}</p>
		</form>
	</Card.Content>
</Card.Root>
