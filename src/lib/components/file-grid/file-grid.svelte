<script lang="ts">
	import { fade } from 'svelte/transition';
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
	import Share from 'carbon-icons-svelte/lib/Share.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import FileActions from '../file-actions/file-actions.svelte';
	import { openModalPreview } from '$lib/utils/open-modal-preview';

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

<div class="w-full">
	<FileTools
		{checkedRows}
		on:albumUpdate={albumUpdate}
		albumId={album ? album.id : null}
		on:selectAll={selectAll}
		on:selectNone={selectNone}
	/>
	{#if mode === 'select'}
		<div class="pb-4 w-full font-semibold text-2xl" transition:fade={{ duration: 300 }}>
			Selected: {checkedRows.length}
		</div>
	{/if}
	<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
		{#each files as row, i}
			<button
				class="rounded-lg border-4 group relative aspect-square
          {checkedRows.includes(row.id) ? 'border-secondary-500' : 'border-transparent'}
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
				<div class="rounded-lg overflow-hidden">
					<FilePreview
						file={row}
						videoControls={false}
						imageClass="aspect-square object-cover"
						containerClass="pointer-events-none z-10 aspect-square overflow-hidden flex justify-center items-center variant-filled-primary group-hover:scale-110 transition-all duration-200 ease-in-out"
					/>
				</div>
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
								mode = 'select';
								checkRow(row.id);
							}}
							class="text-primary-600 hover:text-primary-500"
						>
							{#if checkedRows.includes(row.id)}
								<CheckboxCheckedFilled size={24} />
							{:else}
								<Checkbox size={24} />
							{/if}
						</button>
						<FileActions file={row} on:remove={remove} />
					</div>
				</div>
			</button>
		{/each}
	</div>
	<div class="w-full p-4 sm:p-0 mt-8">
		<FileUploader on:uploaded={uploaded} />
	</div>
</div>
