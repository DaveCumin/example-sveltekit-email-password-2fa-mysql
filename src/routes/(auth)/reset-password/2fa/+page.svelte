<script lang="ts">
	import { enhance } from "$app/forms";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { ActionData } from "./$types";
	import { base } from "$app/paths";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import Pincode from "$lib/components/Pincode.svelte";
	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<Pincode heading="Two-factor authentication" cancelformact="?/signout" submitformact="?/totp" />

<Card.Root class="mx-auto mt-10 w-[350px]">
	<Card.Header>
		<Card.Description>Use your recovery code instead</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			method="post"
			use:enhance={({ formElement, formData, action, cancel }) => {
				return async ({ result }) => {
					const loadingToast = toast.loading("Verifying pin...");
					if (result.type === "redirect") {
						toast.dismiss(loadingToast);
						await goto(result.location, { invalidateAll: true });
					}
					if (result.type === "success") {
						toast.dismiss(loadingToast);
						await goto(`${base}/dashboard`, { invalidateAll: true });
					}
					if (result.type == "failure") {
						toast.dismiss(loadingToast);
						toast.error(result.data.message);
					}
				};
			}}
			action="?/recovery_code"
		>
			<Label for="form-recovery-code.code">Recovery code</Label>
			<Input id="form-recovery-code.code" name="code" required /><br />
			<Button type="submit">Verify recovery code</Button>
		</form>
	</Card.Content>
</Card.Root>
