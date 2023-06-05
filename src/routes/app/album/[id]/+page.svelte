<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AlbumsService } from '$lib/services/albums.service';
	import type { Album } from '$lib/interfaces/album.interface';

	let files: File[] = [];
	let albumId = +$page.params.id;
	let album: Album | null = null;
	let loaded = false;

	const albumsService = AlbumsService.getInstance();

	onMount(async () => {
		album = await albumsService.getAlbum(albumId);
		files = album?.files || [];

		if (album && album.id) {
			loaded = true;
		}
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - {album?.title || 'Album'}</title>
</svelte:head>

{#if loaded}
	<FileTable {files} />
{/if}
