<script lang="ts">
	import Pincode from "$lib/components/Pincode.svelte";
	import type { ActionData } from "./$types";

	interface Props {
		form: ActionData;
		data: PageData;
	}

	let { form, data }: Props = $props();
</script>

<Pincode heading="Verify with code from app" cancelformact="?/signout" submitformact="?/verify" />
