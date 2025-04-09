<script lang="ts">
	import { base } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Sun, Moon, UserRound, LogOut } from "lucide-svelte";
	import { setMode, resetMode } from "mode-watcher";
	import { goto } from "$app/navigation";
	import convertNameToInitials from "$lib/helperFuncs/convertNameToInitials";

	let { user } = $props();

	function signOut() {
		// Create a form element
		var form = document.createElement("form");
		form.method = "POST";
		form.action = `${base}/signout`;
		document.body.appendChild(form);
		form.submit();
	}

	let initials = $derived.by(() => {
		if (user) {
			return convertNameToInitials(user.username);
		}
		return "";
	});
</script>

<header class="sticky top-0 z-40 w-full border-b bg-background">
	<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
		<div class="flex gap-6 md:gap-10">
			<a class="flex items-center space-x-2" href={`${base}/`}>
				<img src={`${base}/favicon.png`} height="32" width="32" alt="PCT Sim" />
				<span class="inline-block font-bold">PCT simulation</span></a
			>
		</div>
		<div class="flex flex-1 items-center justify-end space-x-4">
			<nav class="flex items-center space-x-1">
				{#if !user}
					<Button onclick={() => goto(`${base}/login`)}>Sign in</Button>
				{:else}
					<p class="mr-2" style="cursor: pointer;" onclick={console.log("to implement TODO")}>About</p>
					<Button onclick={signOut}>Sign out</Button>
					<div class="mr-2"></div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="ghost" class="relative h-8 w-8 rounded-full">
								<Avatar.Root class="h-8 w-8">
									<Avatar.Fallback>{initials}</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label class="font-normal">
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
									<p class="text-xs leading-none text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item onclick={() => goto(`${base}/settings`)}>
									<UserRound class="mr-2 h-4 w-4" />
									Profile
									<DropdownMenu.Shortcut></DropdownMenu.Shortcut>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={signOut}>
								<LogOut class="mr-2 h-4 w-4" />
								Sign out
								<DropdownMenu.Shortcut></DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="ghost" size="icon">
							<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon
								class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</nav>
		</div>
	</div>
</header>

<style>
	.active {
		@apply text-primary;
	}
</style>
