<script lang="ts">
	import type { ActionData } from "./$types";
	import Signup from "$lib/components/Signup.svelte";
	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<Signup {form} />
