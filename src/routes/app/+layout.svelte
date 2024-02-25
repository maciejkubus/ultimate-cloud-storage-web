<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import { AppShell, Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import DrawerLeft from '$lib/components/drawer-left/drawer-left.svelte';
	import type { PageMetadataStore } from '$lib/interfaces/page-metadata.inerface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { UserService } from '$lib/services/user.service';

	$: positionClasses = $drawerStore.open ? 'scale-[120%]' : '';

	let user: UserStore;

	let pageMetadata: PageMetadataStore = {
		title: '',
	};

	userStore.subscribe((value) => {
		user = value;
	});

	pageMetadataStore.subscribe((value) => {
		pageMetadata = value;
	});

	onMount(() => {
		if (!browser) return;

		if (user.loggedIn) {
			const userServices = UserService.getInstance();
			console.log(user, userServices.getMe());
		} else {
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
		<div class="container h-full mx-auto flex justify-center flex-row p-8">
			<div class="w-full max-w-6xl">
				<h1 class="text-6xl font-bold mb-8">{pageMetadata.title}</h1>
				<slot />
			</div>
		</div>
		<svelte:fragment slot="pageFooter" />
	</AppShell>
</main>
