<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Navigation from "$lib/components/Navigation.svelte";
	import { setMode, resetMode } from "mode-watcher";
	import { base } from "$app/paths";

	interface Props {
		children?: import("svelte").Snippet;
	}

	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>PCT</title>
</svelte:head>

<Navigation user={data.user} />

<ModeWatcher />
<Toaster richColors class="z-999" />

{@render children?.()}
