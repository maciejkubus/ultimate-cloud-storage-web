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

	export let files: File[] = [];
	export let album: Album | null = null;

	const dispatch = createEventDispatcher();

	const albumsService = AlbumsService.getInstance();
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

	const uploaded = async (event: CustomEvent<File>) => {
		if (album) {
			await albumsService.addFilesToAlbum(album.id, [event.detail.id]);
		}
		files = [...files, event.detail];
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
	<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
		{#each files as row, i}
			<button
				class="aspect-square rounded-lg overflow-hidden border-2
          {checkedRows.includes(row.id) ? 'border-secondary-500' : 'border-transparent'}
        "
				id="file-table-{i}"
				on:click={() => checkRow(row.id)}
			>
				<FilePreview
					file={row}
					imageClass="aspect-square object-cover"
					containerClass="pointer-events-none"
				/>
			</button>
		{/each}
	</div>
	<div class="w-full p-4 sm:p-0 mt-8">
		<FileUploader on:uploaded={uploaded} />
	</div>
</div>
