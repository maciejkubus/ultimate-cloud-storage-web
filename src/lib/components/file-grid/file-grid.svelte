<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { FilesService } from '$lib/services/files.service';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import FileUploader from '../file-uploader/file-uploader.svelte';
	import Checkbox from 'carbon-icons-svelte/lib/Checkbox.svelte';
	import CheckboxCheckedFilled from 'carbon-icons-svelte/lib/CheckboxCheckedFilled.svelte';
	import FileTools from '../file-tools/file-tools.svelte';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';
	import type { Album } from '$lib/interfaces/album.interface';
	import { AlbumsService } from '$lib/services/albums.service';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';
	import { createEventDispatcher } from 'svelte';
	import FilePreview from '../file-preview/file-preview.svelte';

	export let files: File[] = [];
	export let album: Album | null = null;

	const dispatch = createEventDispatcher();

	let mode: 'preview' | 'select' = 'preview';

	const albumsService = AlbumsService.getInstance();
	const filesService = FilesService.getInstance();
	let checkedRows: number[] = [];

	const checkRow = (id: number) => {
		if (checkedRows.includes(id)) {
			checkedRows = checkedRows.filter((row) => row !== id);
		} else {
			checkedRows = [...checkedRows, id];
		}

		if (checkedRows.length <= 0) mode = 'preview';
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

	/*
  imageClass="max-w-screen max-h-screen p-8 pointer-events-none"
	videoClass="max-w-screen max-h-screen p-8"
	noPreviewClass="max-w-screen max-h-screen p-8"
  */
	const openModalPreview = (file: File) => {
		const modalComponent: ModalComponent = {
			ref: FilePreview,
			props: {
				file,
				imageClass: 'max-w-screen max-h-screen p-8 pointer-events-none',
				videoClass: 'max-w-screen max-h-screen p-8',
				noPreviewClass: 'max-w-screen max-h-screen p-8',
			},
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
		};
		modalStore.trigger(modal);
	};
</script>

<div class="w-full">
	<FileTools
		{checkedRows}
		on:albumUpdate={albumUpdate}
		albumId={album ? album.id : null}
		on:selectAll={selectAll}
		on:selectNone={selectNone}
	/>
	{#if mode === 'select'}
		<div class="pb-4 w-full font-semibold text-2xl">
			Selected: {checkedRows.length}
		</div>
	{/if}
	<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
		{#each files as row, i}
			<button
				class="rounded-lg border-4 group relative
          {checkedRows.includes(row.id)
					? 'border-secondary-500 bg-secondary-500'
					: 'border-transparent'}
        "
				id="file-table-{i}"
				on:click={() => {
					if (mode === 'preview') {
						openModalPreview(row);
					} else {
						checkRow(row.id);
					}
				}}
			>
				<FilePreview
					file={row}
					imageClass="rounded-lg aspect-square object-cover"
					containerClass="pointer-events-none z-10"
				/>
				<div
					class="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 w-full flex flex-col gap-1 p-2 variant-filled-secondary absolute top-full -translate-y-1 rounded-lg z-20 text-sm text-left transition-all duration-200 ease-in-out"
				>
					<div class="overflow-hidden text-ellipsis whitespace-nowrap w-full sm:max-w-sm font-bold">
						{row.originalName}
					</div>
					<div class="overflow-hidden text-ellipsis whitespace-nowrap w-full sm:max-w-sm">
						{row.mimetype}
					</div>
					<div class="overflow-hidden text-ellipsis whitespace-nowrap w-full sm:max-w-sm">
						{formatSize(row.size)}
					</div>
					<div class="overflow-hidden text-ellipsis whitespace-nowrap w-full sm:max-w-sm">
						{formatDate(row.created)}
					</div>
					<div class="flex pt-2 gap-2 w-min sm:w-full">
						<button
							on:click|stopPropagation|preventDefault={() => {
								checkRow(row.id);
								mode = 'select';
							}}
							class="text-primary-600 hover:text-primary-500"
						>
							{#if checkedRows.includes(row.id)}
								<CheckboxCheckedFilled size={24} />
							{:else}
								<Checkbox size={24} />
							{/if}
						</button>
						<button
							on:click|stopPropagation|preventDefault={() => openModalPreview(row)}
							class="text-primary-600 hover:text-primary-500"
						>
							<Search size={24} />
						</button>
						<button
							on:click|preventDefault={() => {
								filesService.downloadFile(row.id, row.originalName);
							}}
							class="text-primary-600 hover:text-primary-500"
						>
							<Download size={24} />
						</button>
						<button
							on:click|stopPropagation|preventDefault={() => openModalRemoveFile(row)}
							class="text-primary-600 hover:text-primary-500"
						>
							<TrashCan size={24} />
						</button>
						{#if album}
							<button
								on:click|stopPropagation|preventDefault={() => openModalRemoveFileFromAlbum(row)}
								class="text-primary-600 hover:text-primary-500"
							>
								<FolderOff size={24} />
							</button>
						{/if}
					</div>
				</div>
			</button>
		{/each}
	</div>
	<div class="w-full p-4 sm:p-0 mt-8">
		<FileUploader on:uploaded={uploaded} />
	</div>
</div>
