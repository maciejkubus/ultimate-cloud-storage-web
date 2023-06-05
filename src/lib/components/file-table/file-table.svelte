<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { FilesService } from '$lib/services/files.service';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';

	const filesService = FilesService.getInstance();
	export let files: File[] = [];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString();
		return date;
	};

	const formatSize = (size: number) => {
		const megaBytes = size / 1024 / 1024;
		return megaBytes.toFixed(2) + ' MB';
	};
</script>

<div class="table-container w-full">
	<!-- Native Table Element -->
	<table class="table variant-ghost table-hover table-interactive w-full">
		<thead>
			<tr>
				<th class="w-1/12 text-center">ID</th>
				<th class="w-4/12">Name</th>
				<th class="w-2/12">Type</th>
				<th class="w-2/12">Size</th>
				<th class="w-2/12">Created</th>
				<th class="w-1/12 text-center">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each files as row, i}
				<tr class="h-14">
					<td class="font-bold text-center">{row.id}</td>
					<td class="overflow-hidden text-ellipsis whitespace-nowrap max-w-sm">
						{row.originalName}
					</td>
					<td>{row.mimetype}</td>
					<td>{formatSize(row.size)}</td>
					<td>{formatDate(row.created)}</td>
					<td class="text-center">
						<button
							on:click={() => {
								filesService.downloadFile(row.id, row.originalName);
							}}
							class="hover:text-secondary-500"
						>
							<Download size={24} />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
