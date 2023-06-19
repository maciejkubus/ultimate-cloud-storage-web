<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AlbumsService } from '$lib/services/albums.service';
	import type { Album } from '$lib/interfaces/album.interface';
	import { afterNavigate } from '$app/navigation';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';

	let files: File[] = [];
	let album: Album | null = null;
	let loaded = false;

	const albumsService = AlbumsService.getInstance();

	const loadAlbum = async () => {
		loaded = false;
		album = await albumsService.getAlbum(+$page.params.id);
		files = album?.files || [];

		if (album && album.id) {
			loaded = true;

			pageMetadataStore.set({
				title: 'Album - ' + album.title,
			});
		}
	};

	afterNavigate(loadAlbum);

	const albumUpdate = (event: CustomEvent) => {
		album = event.detail;
		files = album?.files || [];
	};
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - {album?.title || 'Album'}</title>
</svelte:head>

{#if loaded}
	<FileTable {files} {album} on:albumUpdate={albumUpdate} />
{/if}
