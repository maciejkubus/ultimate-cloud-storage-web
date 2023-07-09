<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import Modal from '$lib/components/modal/modal.svelte';
	import ImageSelector from '$lib/components/image-selector/image-selector.svelte';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import { modalStore, toastStore } from '@skeletonlabs/skeleton';
	import { AlbumsService } from '$lib/services/albums.service';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { FilesService } from '$lib/services/files.service';

	export let albumId: number = 0;
	let title: string = 'Select image';
	let images: File[] = [];
	let selected: File | null = null;
	const albumsService = AlbumsService.getInstance();
	const filesService = FilesService.getInstance();

	let paginationData: Paginated = {
		page: 1,
		totalPages: 1,
		lastPage: 1,
	};

	const pageChange = async (event: CustomEvent<Paginated>) => {
		paginationData = event.detail;
		getImages();
	};

	onMount(() => {
		getImages();
	});

	const getImages = async () => {
		const response = await filesService.getFilesByAlbumId(albumId, paginationData.page);
		const page = response.meta.currentPage;
		const lastPage = response.meta.totalPages || 1;
		paginationData = {
			page: page,
			totalPages: lastPage,
			lastPage,
		};
		images = response.data;
	};

	const select = (event: CustomEvent) => {
		selected = event.detail;
	};

	const submit = async () => {
		if (!selected) return;
		try {
			await albumsService.setThumbnail(albumId, selected.id);
		} catch (error) {
			console.error(error);
		}

		if ($modalStore[0].response)
			$modalStore[0].response({
				selected,
				albumId,
			});
		modalStore.close();
	};
</script>

<Modal>
	<svelte:fragment slot="header">{title}</svelte:fragment>
	<div slot="body" class="overflow-y-scroll pr-2 max-h-[600px]">
		<ImageSelector {images} on:select={select} />
		<div class="mt-8">
			<PaginationBar data={paginationData} on:change={pageChange} />
		</div>
	</div>
	<div slot="footer" class="w-full flex justify-end gap-2 flex-col sm:flex-row">
		<button class="btn btn-primary variant-filled-primary" on:click={() => modalStore.close()}>
			Close
		</button>
		<button class="btn btn-primary variant-filled-secondary" on:click={submit}> Select </button>
	</div>
</Modal>
