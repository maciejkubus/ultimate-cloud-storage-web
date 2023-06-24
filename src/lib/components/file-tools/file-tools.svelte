<script lang="ts">
	import { modalStore, toastStore } from '@skeletonlabs/skeleton';
	import type { Album } from '$lib/interfaces/album.interface';
	import { AlbumsService } from '$lib/services/albums.service';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import FolderAdd from 'carbon-icons-svelte/lib/FolderAdd.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';
	import Checkbox from 'carbon-icons-svelte/lib/Checkbox.svelte';
	import CheckboxChecked from 'carbon-icons-svelte/lib/CheckboxChecked.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { FilesService } from '$lib/services/files.service';

	export let checkedRows: number[] = [];
	export let albumId: number | null = null;

	const dispatch = createEventDispatcher();
	const albumsService = AlbumsService.getInstance();
	const filesService = FilesService.getInstance();
	let albums: Album[] = [];

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.close',
	};

	onMount(async () => {
		const response = await albumsService.getMyAlbums(1);
		albums = response.data;
	});

	const selectAll = () => {
		dispatch('selectAll');
	};

	const selectNone = () => {
		dispatch('selectNone');
	};

	const addFilesToAlbum = async (albumId: number) => {
		try {
			const album = await albumsService.addFilesToAlbum(albumId, checkedRows);
			toastStore.trigger({
				message: 'Files added to album successfully',
			});
			dispatch('albumUpdate', album);
		} catch (error) {
			toastStore.trigger({
				message: error + '',
				background: 'variant-filled-error',
			});
		}
	};
	const removeFilesFromAlbum = async (albumId: number) => {
		try {
			const album = await albumsService.removeFilesFromAlbum(albumId, checkedRows);
			toastStore.trigger({
				message: 'Files removed from album successfully',
			});
			dispatch('albumUpdate', album);
		} catch (error) {
			toastStore.trigger({
				message: error + '',
				background: 'variant-filled-error',
			});
		}
	};
	const deleteFiles = async (albumId: number | null) => {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove files',
			body: 'Remove files?',
			response: async (response: boolean) => {
				if (!response) return;
				const success = await filesService.deleteFiles(checkedRows);
				if (!success) {
					toastStore.trigger({
						message: 'Error removing files',
						background: 'variant-filled-error',
					});
				}
				if (albumId) {
					const album = await albumsService.getAlbum(albumId);
					await toastStore.trigger({
						message: 'Files removed from album successfully',
					});
					dispatch('albumUpdate', album);
				}
			},
		});
	};
</script>

<div class="w-full flex justify-between pb-8">
	<div class="w-full flex gap-4 flex-wrap">
		<button
			class="btn btn-primary variant-filled-secondary w-full md:w-auto text-sm"
			on:click={() => selectAll()}
		>
			<CheckboxChecked size={20} /> <span>Select All</span>
		</button>
		<button
			class="btn btn-primary variant-filled-secondary w-full md:w-auto text-sm"
			on:click={() => selectNone()}
		>
			<Checkbox size={20} /> <span>Select None</span>
		</button>
		<button
			class="btn btn-primary variant-filled-secondary w-full md:w-auto text-sm"
			use:popup={popupCombobox}
		>
			<FolderAdd size={20} /> <span>Add to album</span>
		</button>
		<div class="card w-48 shadow-xl py-2 overflow-hidden" data-popup="popupCombobox">
			<ul class="list py-2 max-h-48 overflow-y-scroll">
				<!-- {#each albums as album}
					<li
						class="px-4 py-2 rounded-none hover:variant-soft-tertiary hover:rounded-none cursor-pointer close"
						on:click={() => addFilesToAlbum(album.id)}
					>
						{album.title}
					</li>
				{/each} -->
			</ul>
			<div class="arrow bg-surface-100-800-token" />
		</div>

		{#if albumId}
			<button
				class="btn btn-primary variant-filled-secondary w-full md:w-auto text-sm"
				on:click={() => (albumId ? removeFilesFromAlbum(albumId) : null)}
			>
				<FolderOff size={20} /> <span>Remove from album</span>
			</button>
		{/if}
		<button
			class="btn btn-primary variant-filled-secondary w-full md:w-auto text-sm"
			on:click={() => deleteFiles(albumId)}
		>
			<TrashCan size={20} /> <span>Remove files</span>
		</button>
	</div>
	<!-- <div class="card variant-ghost px-4">d</div> -->
</div>
