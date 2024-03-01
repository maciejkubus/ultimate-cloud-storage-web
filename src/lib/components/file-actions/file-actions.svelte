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
	import { openModalPreview } from '$lib/utils/open-modal-preview';

	export let album: Album | null = null;
	export let file: File;
	const filesService = FilesService.getInstance();
	const dispatch = createEventDispatcher();

	const openModalRemoveFile = (file: File) => {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove file',
			body: 'Remove file ' + file.originalName + '?',
			response: async (response: boolean) => {
				if (!response) return;

				const success = await filesService.deleteFile(file.id);
				if (success) dispatch('remove', file);
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
				if (success) dispatch('remove', file);
			},
		});
	};

	const shareFileModal = async (file: File) => {
		const protocol = window ? window.location.protocol : '';
		const host = window ? window.location.host : '';
		const link = protocol + '//' + host + '/public/' + file.id;
		const modal: ModalSettings = {
			type: 'alert',
			title: 'File shared',
			body: `<a href=${link} target="_blank">${link}</a>`,
		};
		modalStore.trigger(modal);
		navigator.clipboard.writeText(link);
		toastStore.trigger({
			message: 'Link copied!',
		});
	};

	const shareFile = async (file: File) => {
		try {
			await filesService.shareFile(file.id);
			shareFileModal(file);
		} catch (err) {
			console.error(err);
		}
	};
</script>

<button
	on:click|stopPropagation|preventDefault={() => openModalPreview(file)}
	class="text-primary-600 hover:text-primary-500"
>
	<Search size={24} />
</button>
<button
	on:click|preventDefault={() => {
		filesService.downloadFile(file.id, file.originalName);
	}}
	class="text-primary-600 hover:text-primary-500"
>
	<Download size={24} />
</button>
<button
	on:click|stopPropagation|preventDefault={() => openModalRemoveFile(file)}
	class="text-primary-600 hover:text-primary-500"
>
	<TrashCan size={24} />
</button>
{#if album}
	<button
		on:click|stopPropagation|preventDefault={() => openModalRemoveFileFromAlbum(file)}
		class="text-primary-600 hover:text-primary-500"
	>
		<FolderOff size={24} />
	</button>
{/if}
<button
	on:click|stopPropagation|preventDefault={() => shareFile(file)}
	class="text-primary-600 hover:text-primary-500"
>
	<Share size={24} />
</button>
