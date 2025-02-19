<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Email and password example with 2FA in SvelteKit</title>
</svelte:head>

{@render children?.()}
