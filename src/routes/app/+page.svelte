<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import { FilesService } from '$lib/services/files.service';
	import { onMount } from 'svelte';
	import type { File } from '$lib/interfaces/file.interface';
	export let files: File[] = [];

	const filesService = FilesService.getInstance();

	onMount(async () => {
		files = await filesService.getAllMineFiles();
	});
</script>

<div class="w-full max-w-6xl">
	<FileTable {files} />
</div>
