<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { Album } from '$lib/interfaces/album.interface';
	import { AlbumsService } from '$lib/services/albums.service';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import FolderAdd from 'carbon-icons-svelte/lib/FolderAdd.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';

	export let checkedRows: number[] = [];
	export let albumId: number | null = null;

	const dispatch = createEventDispatcher();
	const albumsService = AlbumsService.getInstance();
	let albums: Album[] = [];

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.close',
	};

	onMount(async () => {
		albums = await albumsService.getMyAlbums();
	});

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
</script>

<div class="w-full flex justify-between pb-8">
	<div class="w-full flex gap-4 flex-wrap">
		<button
			class="btn btn-primary variant-filled-secondary w-full md:w-auto"
			use:popup={popupCombobox}
		>
			<FolderAdd size={24} /> <span>Add to album</span>
		</button>
		<div class="card w-48 shadow-xl py-2 overflow-hidden" data-popup="popupCombobox">
			<ul class="list py-2 max-h-48 overflow-y-scroll">
				{#each albums as album}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						class="px-4 py-2 rounded-none hover:variant-soft-tertiary hover:rounded-none cursor-pointer close"
						on:click={() => addFilesToAlbum(album.id)}
					>
						{album.title}
					</li>
				{/each}
			</ul>
			<div class="arrow bg-surface-100-800-token" />
		</div>

		{#if albumId}
			<button
				class="btn btn-primary variant-filled-secondary w-full md:w-auto"
				on:click={() => (albumId ? removeFilesFromAlbum(albumId) : null)}
			>
				<FolderOff size={24} /> <span>Remove from album</span>
			</button>
		{/if}
	</div>
	<!-- <div class="card variant-ghost px-4">d</div> -->
</div>
