<script lang="ts">
	import type { Album } from '$lib/interfaces/album.interface';
	import { albumStore } from '$lib/stores/album.store';
	import { onMount } from 'svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { AlbumsService } from '$lib/services/albums.service';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import Pen from 'carbon-icons-svelte/lib/Pen.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { goto } from '$app/navigation';
	import Image from 'carbon-icons-svelte/lib/Image.svelte';
	import ModalSelectImage from '../modal-select-image.svelte/modal-select-Image.svelte';
	import FilePreview from '../file-preview/file-preview.svelte';

	const albumsService = AlbumsService.getInstance();
	let albums: Album[] = [];
	let loaded = false;

	onMount(async () => {
		albums = await albumsService.getMyAlbums();
		albumStore.subscribe((value) => {
			albums = value.albums;
		});
		loaded = true;
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString();
		return date;
	};

	const openModalAddAlbum = () => {
		modalStore.trigger({
			type: 'prompt',
			title: 'Add album',
			body: 'Provide name for the new album',
			value: '',
			valueAttr: {
				type: 'text',
				minlength: 3,
				maxlength: 24,
				required: true,
				placeholder: 'Album name',
			},
			response: async (albumName: string) => {
				await albumsService.createAlbum({
					title: albumName,
				});
			},
		});
	};

	const openModalEditAlbum = (album: Album) => {
		modalStore.trigger({
			type: 'prompt',
			title: 'Edit album #' + album.id,
			body: 'Provide new name for the album',
			value: album.title,
			valueAttr: {
				type: 'text',
				minlength: 3,
				maxlength: 24,
				required: true,
				placeholder: 'Album name',
			},
			response: async (albumName: string) => {
				await albumsService.editAlbum({
					id: album.id,
					title: albumName,
				});
			},
		});
	};

	const openModalRemoveAlbum = (album: Album) => {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove album',
			body: 'Remove album ' + album.title + '?',
			response: (response: boolean) => {
				if (!response) return;
				albumsService.deleteAlbum(album.id);
			},
		});
	};

	const openModalSetThumbnail = async (album: Album) => {
		const fetchedAlbum = await albumsService.getAlbum(album.id);
		const files = fetchedAlbum.files;
		const images = files.filter((file) => file.mimetype.includes('image'));
		const modalComponent: ModalComponent = {
			ref: ModalSelectImage,
			props: {
				images,
				title: 'Select thumbnail',
				albumId: album.id,
			},
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
			response: async (response: any) => {
				const changedAlbum = albums.find((album) => album.id === response.albumId);
				if (!changedAlbum) return;
				albums = await albumsService.getMyAlbums();
			},
		};
		modalStore.trigger(modal);
	};
</script>

<div>
	<div class="w-full flex justify-between pb-8">
		<button class="btn btn-primary variant-filled-secondary" on:click={openModalAddAlbum}>
			<Add size={24} />
			<span>Add album</span>
		</button>
	</div>
	<div>
		{#if loaded && albums.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
				{#each albums as album}
					<a
						href="/app/albums/{album.id}"
						class="card variant-glass-tertiary cursor-pointer text-primary-500 relative overflow-hidden flex flex-col"
						on:click={() => goto('/app/albums/' + album.id)}
					>
						{#if album.thumbnail}
							<div class="absolute -z-10 inset-0 pointer-events-none opacity-30 flex">
								<FilePreview
									file={album.thumbnail}
									imageClass="object-cover flex-1"
									containerClass="flex justify-center items-center"
								/>
							</div>
						{/if}
						<header class="card-header">
							<h3 class="h3">{album.title}</h3>
						</header>
						<div class="card-body p-4 flex-1">
							<div class="text-sm">
								<span class="font-bold"> Updated: </span>
								<span> {formatDate(album.updated)} </span>
							</div>
							<div class="text-sm">
								<span class="font-bold"> Created: </span>
								<span> {formatDate(album.created)} </span>
							</div>
						</div>
						<footer class="card-footer flex justify-between items-end">
							<div>
								<button
									class="hover:text-tertiary-500"
									on:click|stopPropagation|preventDefault={() => openModalRemoveAlbum(album)}
								>
									<TrashCan size={24} />
								</button>
								<button
									class="hover:text-tertiary-500"
									on:click|stopPropagation|preventDefault={() => openModalSetThumbnail(album)}
								>
									<Image size={24} />
								</button>
								<button
									class="hover:text-tertiary-500"
									on:click|stopPropagation|preventDefault={() => openModalEditAlbum(album)}
								>
									<Pen size={24} />
								</button>
							</div>
							<div>
								<div class="hover:text-tertiary-500">
									<ArrowRight size={32} />
								</div>
							</div>
						</footer>
					</a>
				{/each}
			</div>
		{:else}
			<div class="card px-4 py-8 variant-ringed-surface text-center space-y-4">
				<h2 class="h2">It seems like you haven't created any albums yet.</h2>
				<p>
					But no worries, you can create one
					<button class="text-tertiary-500" on:click={openModalAddAlbum}> here </button>
				</p>
			</div>
		{/if}
	</div>
</div>
