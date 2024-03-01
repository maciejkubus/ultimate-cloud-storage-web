<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import { FilesService } from '$lib/services/files.service';
	import { onMount } from 'svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import FileExplorer from '$lib/components/file-explorer/file-explorer.svelte';

	let files: File[] = [];
	const filesService = FilesService.getInstance();
	let paginationData: Paginated = {
		page: 1,
		totalPages: 1,
		lastPage: 1,
	};
	let loaded = false;

	onMount(() => {
		pageMetadataStore.set({
			title: 'All Files',
		});
		loadFiles();
	});

	const pageChange = async (event: CustomEvent<Paginated>) => {
		paginationData = event.detail;
		loadFiles();
	};

	const loadFiles = async () => {
		loaded = false;
		files = [];
		const response = await filesService.getAllMineFiles(paginationData.page);
		paginationData = {
			page: response.meta.currentPage,
			totalPages: response.meta.totalPages,
			lastPage: response.meta.totalPages,
		};
		files = response.data;
		loaded = true;
	};

	const remove = () => {
		loadFiles();
	};
</script>

<FileExplorer {files} on:remove={remove} />
<div class="mt-8">
	<PaginationBar data={paginationData} on:change={pageChange} />
</div>
