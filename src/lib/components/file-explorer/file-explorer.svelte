<script lang="ts">
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import Grid from 'carbon-icons-svelte/lib/Grid.svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import type { Album } from '$lib/interfaces/album.interface';
	import { createEventDispatcher, onMount } from 'svelte';
	import FileTable from '../file-table/file-table.svelte';
	import FileGrid from '../file-grid/file-grid.svelte';
	import { userStore } from '$lib/stores/user.store';

	export let files: File[] = [];
	export let album: Album | null = null;

	const dispatch = createEventDispatcher();

	let view: 'table' | 'grid' = 'table';

	onMount(() => {
		userStore.subscribe((store) => {
			view = store.preferences.view;
		});
	});

	const albumUpdate = (event: CustomEvent<Album>) => {
		dispatch('albumUpdate', event.detail);
	};

	const changeView = (view: 'table' | 'grid') => {
		userStore.update((store) => {
			return {
				...store,
				preferences: {
					view: view,
				},
			};
		});
	};
</script>

<div class="w-full mb-4 flex">
	<button
		class="variant-filled-secondary p-2 rounded-l-lg {view != 'table' ? 'opacity-50' : ''}"
		on:click={() => changeView('table')}
	>
		<TableSplit size={20} />
	</button>
	<button
		class="variant-filled-secondary p-2 rounded-r-lg {view != 'grid' ? 'opacity-50' : ''}"
		on:click={() => changeView('grid')}
	>
		<Grid size={20} />
	</button>
</div>

{#if view === 'table'}
	<FileTable {files} {album} on:albumUpdate={albumUpdate} />
{:else}
	<FileGrid {files} {album} on:albumUpdate={albumUpdate} />
{/if}
