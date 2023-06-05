<script lang="ts">
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

	const drawerSettings: DrawerSettings = {
		id: 'menu',
		bgDrawer: 'bg-surface-500',
		bgBackdrop: 'bg-secondary-500 bg-opacity-20',
		width: 'w-full md:w-64',
		padding: 'p-4',
		rounded: 'rounded-lg',
		duration: 250,
	};

	const openDrawer = () => {
		drawerStore.open(drawerSettings);
	};
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<div on:click={openDrawer} aria-hidden="true" class="cursor-pointer">
			<Menu size={32} />
		</div>
	</svelte:fragment>
	<div class="text-center flex-1 flex justify-center items-center text-xl font-bold tracking-wider">
		ULTIMATE <img src="/favicon.png" alt="logo" class="h-8 inline" /> STORAGE
	</div>
	<svelte:fragment slot="trail">(actions)</svelte:fragment>
</AppBar>
