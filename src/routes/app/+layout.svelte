<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import { AppShell, Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	$: positionClasses = $drawerStore.open ? 'scale-[120%]' : '';

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});

	onMount(() => {
		if (browser && !user.loggedIn) {
			window.location.href = '/auth/login';
		}
	});
</script>

<Drawer>
	{#if $drawerStore.id === 'menu'}
		menu
	{/if}
</Drawer>
<main class="transition-transform duration-400 ease-in {positionClasses}">
	<AppShell
		slotSidebarLeft="flex w-5/6 md:w-64"
		class="transition-transform {positionClasses}"
		regionPage="variant-ringed-surface"
	>
		<svelte:fragment slot="header">
			<Header />
		</svelte:fragment>
		<!-- <svelte:fragment slot="sidebarLeft">
		<NavBar />
	</svelte:fragment> -->
		<slot />
		<svelte:fragment slot="pageFooter" />
	</AppShell>
</main>
