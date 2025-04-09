<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import { setMode, resetMode } from "mode-watcher";

	interface Props {
		children?: import("svelte").Snippet;
	}

	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>PCT</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors class="z-999" />

<button on:click={() => setMode("light")}>Light</button>
<button on:click={() => setMode("dark")}>Dark</button>
<button on:click={() => resetMode()}>System</button>

{@render children?.()}
