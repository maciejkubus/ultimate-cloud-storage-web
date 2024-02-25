<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import type { Album } from '$lib/interfaces/album.interface';
	import { createEventDispatcher } from 'svelte';
	import FileTable from '../file-table/file-table.svelte';

	export let files: File[] = [];
	export let album: Album | null = null;

	const dispatch = createEventDispatcher();

	const albumUpdate = (event: CustomEvent<Album>) => {
		dispatch('albumUpdate', event.detail);
	};
</script>

<FileTable {files} {album} on:albumUpdate={albumUpdate} />
