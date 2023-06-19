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
	import ImagePreview from '../image-preview/image-preview.svelte';
	import { createEventDispatcher } from 'svelte';
	import CheckboxChecked from 'carbon-icons-svelte/lib/CheckboxChecked.svelte';

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

	const openModalRemoveFile = (file: File) => {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove file',
			body: 'Remove file ' + file.originalName + '?',
			response: async (response: boolean) => {
				if (!response) return;

				const success = await filesService.deleteFile(file.id);
				if (success) files = files.filter((f) => f.id !== file.id);
			},
		});
	};

	const openModalRemoveFileFromAlbum = (file: File) => {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove file from album',
			body: 'Remove file ' + file.originalName + ' from album ' + album?.title + '?',
			response: async (response: boolean) => {
				if (!response) return;
				if (!album) return;

				const success = await filesService.removeFileFromAlbum(file.id, album.id);
				if (success) files = files.filter((f) => f.id !== file.id);
			},
		});
	};

	const uploaded = async (event: CustomEvent<File>) => {
		if (album) {
			await albumsService.addFilesToAlbum(album.id, [event.detail.id]);
		}
		files = [...files, event.detail];
	};

	const openModalPreview = (file: File) => {
		const modalComponent: ModalComponent = {
			ref: ImagePreview,
			props: { file },
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
		};
		modalStore.trigger(modal);
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
							<button
								on:click|stopPropagation|preventDefault={() => openModalPreview(row)}
								class="text-tertiary-500 hover:text-primary-500"
							>
								<Search size={24} />
							</button>
							<button
								on:click|preventDefault={() => {
									filesService.downloadFile(row.id, row.originalName);
								}}
								class="text-tertiary-500 hover:text-primary-500"
							>
								<Download size={24} />
							</button>
							<button
								on:click|stopPropagation|preventDefault={() => openModalRemoveFile(row)}
								class="text-tertiary-500 hover:text-primary-500"
							>
								<TrashCan size={24} />
							</button>
							{#if album}
								<button
									on:click|stopPropagation|preventDefault={() => openModalRemoveFileFromAlbum(row)}
									class="text-tertiary-500 hover:text-primary-500"
								>
									<FolderOff size={24} />
								</button>
							{/if}
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
