<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AlbumsService } from '$lib/services/albums.service';
	import type { Album } from '$lib/interfaces/album.interface';
	import { afterNavigate } from '$app/navigation';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { FilesService } from '$lib/services/files.service';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import FileExplorer from '$lib/components/file-explorer/file-explorer.svelte';

	let files: File[] = [];
	let album: Album | null = null;
	let loaded = false;

	let paginationData: Paginated = {
		page: 1,
		totalPages: 1,
		lastPage: 1,
	};

	const albumsService = AlbumsService.getInstance();
	const filesService = FilesService.getInstance();

	const pageChange = async (event: CustomEvent<Paginated>) => {
		paginationData = event.detail;
		loadAlbum();
	};

	const loadAlbum = async () => {
		loaded = false;
		album = await albumsService.getAlbum(+$page.params.id);
		const response = await filesService.getFilesByAlbumId(+$page.params.id, paginationData.page);
		files = response.data;
		paginationData = {
			page: response.meta.currentPage,
			totalPages: response.meta.totalPages,
			lastPage: response.meta.totalPages,
		};

		if (album && album.id) {
			loaded = true;

			pageMetadataStore.set({
				title: 'Album - ' + album.title,
			});
		}
	};

	afterNavigate(() => {
		paginationData = {
			page: 1,
			totalPages: 1,
			lastPage: 1,
		};
		loadAlbum();
	});

	const albumUpdate = (event: CustomEvent) => {
		album = event.detail;
		files = album?.files || [];
		loadAlbum();
	};

	const remove = () => {
		loadAlbum();
	};
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - {album?.title || 'Album'}</title>
</svelte:head>

{#if loaded}
	<FileExplorer {files} {album} on:albumUpdate={albumUpdate} on:remove={remove} />
	<div class="mt-8">
		<PaginationBar data={paginationData} on:change={pageChange} />
	</div>
{/if}
