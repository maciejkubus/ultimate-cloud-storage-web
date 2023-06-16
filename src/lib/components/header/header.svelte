<script lang="ts">
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
	import { goto } from '$app/navigation';

	const drawerSettings: DrawerSettings = {
		id: 'menu',
		bgDrawer: 'bg-surface-500',
		bgBackdrop: 'bg-surface-500 bg-opacity-20 backdrop-blur-sm',
		width: 'w-full md:w-64',
		padding: 'p-4',
		rounded: 'rounded-lg',
		duration: 250,
	};

	const openDrawer = () => {
		drawerStore.open(drawerSettings);
	};

	const logout = () => {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = '/';
	};
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<div on:click={openDrawer} aria-hidden="true" class="cursor-pointer">
			<Menu size={32} />
		</div>
	</svelte:fragment>
	<div
		class="text-center flex-1 flex flex-col sm:flex-row justify-center items-center text-md sm:text-xl font-bold tracking-wider"
	>
		<span>ULTIMATE</span> <img src="/favicon.png" alt="logo" class="h-8 hidden sm:inline" />
		<span>STORAGE</span>
	</div>
	<svelte:fragment slot="trail">
		<button on:click|preventDefault={logout}>
			<Logout size={20} />
		</button>
		<a
			on:click={() => {
				drawerStore.close();
				goto('/app/settings');
			}}
			href="/app/settings"
			class="text-primary-500"
		>
			<Settings size={24} />
		</a>
	</svelte:fragment>
</AppBar>
