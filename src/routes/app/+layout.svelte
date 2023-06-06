<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import { AppShell, Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import FileUploader from '$lib/components/file-uploader/file-uploader.svelte';
	import DrawerLeft from '$lib/components/drawer-left/drawer-left.svelte';

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
		<DrawerLeft />
	{/if}
</Drawer>
<main class="transition-transform duration-400 ease-in {positionClasses} h-full relative">
	<AppShell
		slotSidebarLeft="flex w-5/6 md:w-64"
		class="transition-transform {positionClasses}"
		regionPage="variant-ringed-surface"
	>
		<svelte:fragment slot="header">
			<Header />
		</svelte:fragment>
		<div class="container h-full mx-auto flex justify-center items-center flex-row">
			<slot />
		</div>
		<svelte:fragment slot="pageFooter" />
	</AppShell>
</main>
