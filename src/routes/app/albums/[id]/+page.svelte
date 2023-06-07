<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AlbumsService } from '$lib/services/albums.service';
	import type { Album } from '$lib/interfaces/album.interface';
	import { afterNavigate } from '$app/navigation';

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
		}
	};

	afterNavigate(loadAlbum);
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - {album?.title || 'Album'}</title>
</svelte:head>

{#if loaded}
	<div class="w-full max-w-6xl">
		<FileTable {files} />
	</div>
{/if}
