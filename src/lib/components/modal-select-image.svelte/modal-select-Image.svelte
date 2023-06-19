<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import Modal from '$lib/components/modal/modal.svelte';
	import ImageSelector from '$lib/components/image-selector/image-selector.svelte';
	import { modalStore, toastStore } from '@skeletonlabs/skeleton';
	import { AlbumsService } from '$lib/services/albums.service';
	import { createEventDispatcher } from 'svelte';

	export let images: File[] = [];
	export let title: string = 'Select image';
	export let albumId: number = 0;
	let selected: File | null = null;
	const albumsService = AlbumsService.getInstance();

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
	</div>
	<div slot="footer" class="w-full flex justify-end gap-2 flex-col sm:flex-row">
		<button class="btn btn-primary variant-filled-primary" on:click={() => modalStore.close()}>
			Close
		</button>
		<button class="btn btn-primary variant-filled-secondary" on:click={submit}> Select </button>
	</div>
</Modal>
