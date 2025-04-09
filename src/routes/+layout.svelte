<script lang="ts">
	import "../app.css";
	interface Props {
		children?: import("svelte").Snippet;
	}

	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>PCT</title>
</svelte:head>

<Toaster />

{@render children?.()}
