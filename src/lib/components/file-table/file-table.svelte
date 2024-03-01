<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { FilesService } from '$lib/services/files.service';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import FileUploader from '../file-uploader/file-uploader.svelte';
	import FileTools from '../file-tools/file-tools.svelte';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';
	import type { Album } from '$lib/interfaces/album.interface';
	import { AlbumsService } from '$lib/services/albums.service';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';
	import { createEventDispatcher } from 'svelte';
	import FilePreview from '../file-preview/file-preview.svelte';
	import Share from 'carbon-icons-svelte/lib/Share.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import FileActions from '../file-actions/file-actions.svelte';

	export let files: File[] = [];
	export let album: Album | null = null;

	const dispatch = createEventDispatcher();

	const albumsService = AlbumsService.getInstance();
	const filesService = FilesService.getInstance();
	let checkedRows: number[] = [];

	const checkRow = (id: number) => {
		if (checkedRows.includes(id)) {
			checkedRows = checkedRows.filter((row) => row !== id);
		} else {
			checkedRows = [...checkedRows, id];
		}
	};

	const selectAll = () => {
		checkedRows = files.map((row) => row.id);
	};

	const selectNone = () => {
		checkedRows = [];
	};

	const albumUpdate = (event: CustomEvent<Album>) => {
		checkedRows = [];
		dispatch('albumUpdate', event.detail);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString();
		return date;
	};

	const formatSize = (size: number) => {
		const megaBytes = size / 1024 / 1024;
		return megaBytes.toFixed(2) + ' MB';
	};

	const uploaded = async (event: CustomEvent<File>) => {
		if (album) {
			await albumsService.addFilesToAlbum(album.id, [event.detail.id]);
		}
		files = [...files, event.detail];
	};

	const remove = (event: CustomEvent<File>) => {
		dispatch('remove', event.detail);
	};
</script>

<div class="table-container w-full">
	<FileTools
		{checkedRows}
		on:albumUpdate={albumUpdate}
		albumId={album ? album.id : null}
		on:selectAll={selectAll}
		on:selectNone={selectNone}
	/>
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
						class="overflow-hidden text-ellipsis whitespace-nowrap w-[100px] max-w-[100px] sm:max-w-sm"
					>
						{row.originalName}
					</td>
					<td class="hidden xl:table-cell">{row.mimetype}</td>
					<td class="hidden xl:table-cell">{formatSize(row.size)}</td>
					<td class="hidden md:table-cell">{formatDate(row.created)}</td>
					<td>
						<div class="flex justify-center items-center gap-2 w-min sm:w-full">
							<FileActions file={row} on:remove={remove} />
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
