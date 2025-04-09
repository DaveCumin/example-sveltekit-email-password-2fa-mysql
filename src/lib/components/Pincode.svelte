<script>
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { cn } from "$lib/utils.ts";

	let { beforesnip = () => {}, informsnip = () => {}, heading, N = 6, cancelformact, submitformact } = $props();

	const idtext = "input_";
	const inputs = new Array(N).fill(0).map((_, i) => i);
	let values = $state(new Array(N).fill(""));
	let output = $state("");

	function keypress(event) {
		const key = event.key;
		const nextinputN = Number(event.target.id.replace(idtext, "")) + 1;

		if (key >= 0 && key <= 9) {
			values[event.target.id.replace(idtext, "")] = key;
			if (nextinputN < N) {
				document.getElementById(idtext + nextinputN).focus();
			} else {
				document.getElementById("pinsubmit").focus();
			}
		}
		if (key === "Backspace") {
			event.preventDefault();
			document.getElementById(idtext + (nextinputN - 2))?.select();
			values[event.target.id.replace(idtext, "")] = "";
		}
		output = values.join("");
	}

	onMount(() => {
		document.getElementById(idtext + 0).focus();
	});

	let canceling = $state(false);
</script>

<div class="card" style="margin: 50px auto;">
	<label>{heading}</label>

	{@render beforesnip()}

	<div id="inputs">
		{#each inputs as id}
			<input
				id={idtext + id}
				class={cn(
					"h-10 rounded-md border border-input bg-background p-6 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				)}
				type="text"
				maxLength="1"
				onkeydown={keypress}
				onkeypress={(event) => event.preventDefault()}
				bind:value={values[id]}
			/>
		{/each}
	</div>

	<form
		method="POST"
		use:enhance={({ formElement, formData, action, cancel }) => {
			return async ({ result }) => {
				const loadingToast = toast.loading("Verifying pin...");
				if (canceling) {
					toast.dismiss(loadingToast);
				}
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
	>
		{@render informsnip()}
		<input type="hidden" name="code" bind:value={output} />
		<div class="flex-row">
			{#if cancelformact != ""}
				<button id="pincancel" class="button-cancel" formaction={cancelformact}>Cancel</button>
			{/if}
			<button id="pinsubmit" class="button-submit" onclick={(canceling = true)} formaction={submitformact}
				>Verify</button
			>
		</div>
	</form>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		padding: 30px;
		width: 320px;
		border-radius: 0.5rem;
		border: 1.5px solid #ecedec;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	form {
		width: 100%;
	}
	input {
		width: 2.5em;
		height: 2.5em;
		text-align: center;
		border-radius: 8px;
		border: 1.5px solid #ecedec;
		margin: 2px;
	}

	input:focus {
		border: 1.5px solid #acacac;
		outline: none;
	}

	.button-submit {
		margin: 12px 0 10px 0;
		background-color: #151717;
		border: none;
		color: white;
		font-size: 15px;
		font-weight: 500;
		border-radius: 8px;
		height: 3em;
		width: 100%;
		cursor: pointer;
	}
	.button-submit:focus {
		border: 1.5px solid #acacac;
	}

	.button-cancel {
		margin: 12px 0 10px 0;
		background-color: white;
		border: 1.5px solid #ecedec;
		color: #151717;
		font-size: 15px;
		font-weight: 500;
		border-radius: 8px;
		height: 3em;
		width: 100%;
		cursor: pointer;
	}
	.button-cancel:focus {
		border: 1.5px solid #acacac;
	}
	.button-cancel:hover,
	.button-submit:hover {
		filter: opacity(0.8);
	}

	.flex-row {
		display: flex;
		gap: 10px;
		justify-content: center;
	}
</style>
