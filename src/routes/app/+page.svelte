<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import { FilesService } from '$lib/services/files.service';
	import { onMount } from 'svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	export let files: File[] = [];

	const filesService = FilesService.getInstance();

	onMount(async () => {
		files = await filesService.getAllMineFiles();
		pageMetadataStore.set({
			title: 'All Files',
		});
	});
</script>

<FileTable {files} />
