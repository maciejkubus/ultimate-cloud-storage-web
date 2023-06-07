<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { FilesService } from '$lib/services/files.service';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import FileUploader from '../file-uploader/file-uploader.svelte';
	import { onMount } from 'svelte';
	import FileTools from '../file-tools/file-tools.svelte';

	const filesService = FilesService.getInstance();
	export let files: File[] = [];
	let toDelete: number = 0;
	let checkedRows: number[] = [];

	const checkRow = (id: number) => {
		if (checkedRows.includes(id)) {
			checkedRows = checkedRows.filter((row) => row !== id);
		} else {
			checkedRows = [...checkedRows, id];
		}
	};

	const clearRows = () => {
		checkedRows = [];
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString();
		return date;
	};

	const formatSize = (size: number) => {
		const megaBytes = size / 1024 / 1024;
		return megaBytes.toFixed(2) + ' MB';
	};

	const confirmRemoveClick: PopupSettings = {
		event: 'click',
		target: 'confirmRemoveClick',
		placement: 'top',
		closeQuery: '.close-btn',
	};

	const deleteFile = async () => {
		await filesService.deleteFile(toDelete);
		files = await filesService.getAllMineFiles();
	};

	const uploaded = (event: CustomEvent<File>) => {
		files = [...files, event.detail];
	};
</script>

<div class="card p-4 variant-filled-primary" data-popup="confirmRemoveClick">
	<div>Are you sure you want to delete this file?</div>
	<div class="w-100 flex justify-center items-center mt-2 flex-row gap-2 flex-nowrap">
		<button
			class="p-1 variant-filled-primary hover:variant-filled-success transition-colors rounded-full close-btn"
			on:click|preventDefault={deleteFile}
		>
			<Checkmark size={20} />
		</button>
		<button
			class="p-1 variant-filled-primary hover:variant-filled-error transition-colors rounded-full close-btn"
		>
			<Close size={20} />
		</button>
	</div>
</div>

<div class="table-container w-full p-4 sm:p-0">
	<FileTools {checkedRows} on:addedToAlbum={clearRows} />
	<table class="table variant-ghost table-hover table-interactive w-full">
		<thead>
			<tr>
				<th class="sm:w-1/12 text-center hidden sm:table-cell">ID</th>
				<th class="w-full sm:w-4/12">Name</th>
				<th class="sm:w-2/12 hidden xl:table-cell">Type</th>
				<th class="sm:w-2/12 hidden xl:table-cell">Size</th>
				<th class="sm:w-2/12 hidden md:table-cell">Created</th>
				<th class="sm:w-1/12 text-center">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each files as row, i}
				<tr
					class="h-14"
					class:table-row-checked={checkedRows.includes(row.id)}
					id="file-table-{i}"
					on:click={() => checkRow(row.id)}
				>
					<td class="font-bold text-center hidden sm:table-cell">{row.id}</td>
					<td
						class="overflow-hidden text-ellipsis whitespace-nowrap w-[120px] max-w-[120px] sm:max-w-sm"
					>
						{row.originalName}
					</td>
					<td class="hidden xl:table-cell">{row.mimetype}</td>
					<td class="hidden xl:table-cell">{formatSize(row.size)}</td>
					<td class="hidden md:table-cell">{formatDate(row.created)}</td>
					<td>
						<div class="flex justify-center items-center gap-2 w-min sm:w-full">
							<button
								on:click|preventDefault={() => {
									filesService.downloadFile(row.id, row.originalName);
								}}
								class="text-tertiary-500 hover:text-primary-500"
							>
								<Download size={24} />
							</button>
							<button
								use:popup={confirmRemoveClick}
								on:click|preventDefault={() => (toDelete = row.id)}
								class="text-tertiary-500 hover:text-primary-500"
							>
								<TrashCan size={24} />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="w-full p-4 sm:p-0 mt-8">
		<FileUploader on:uploaded={uploaded} />
	</div>
</div>