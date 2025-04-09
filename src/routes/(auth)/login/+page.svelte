<script lang="ts">
	import type { ActionData } from "./$types";
	import Login from "$lib/components/Login.svelte";
	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<Login {form} />
