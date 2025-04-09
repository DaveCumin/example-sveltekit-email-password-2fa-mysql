<script lang="ts">
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { PageData } from "./$types";

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<header>
	<a href={base}>Home</a>
	<a href={`${base}/settings`}>Settings</a>
</header>
<main>
	<h1>Hi {data.user.username}!</h1>
	<form method="post" use:enhance>
		<Button type="submit">Sign out</Button>
	</form>
</main>
