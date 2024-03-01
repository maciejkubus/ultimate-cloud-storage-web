<script lang="ts">
	import { page } from '$app/stores';
	import { FilesService } from '$lib/services/files.service';
	import { onMount } from 'svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import FilePreview from '$lib/components/file-preview/file-preview.svelte';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Share from 'carbon-icons-svelte/lib/Share.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';

	const filesService = FilesService.getInstance();
	let file: File | null = null;

	onMount(async () => {
		const id = $page.params.id;
		file = await filesService.getFile(+id, 'public');
	});

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
</script>

<svelte:head>
	<title>Ultimate Cloud Storage {file?.originalName}</title>
</svelte:head>

<div class="h-screen w-full flex flex-col justify-stretch">
	<div class="w-full p-4 flex flex-col md:flex-row">
		<div class="flex-1 hidden md:block">
			{#if file}
				<button
					on:click|preventDefault={() => {
						if (file) shareFileModal(file);
					}}
					class="text-primary-600 hover:text-primary-500"
				>
					<Share size={32} />
				</button>
			{/if}
		</div>
		<a
			class="text-center flex-1 flex flex-col sm:flex-row justify-center items-center text-md sm:text-xl font-bold tracking-wider"
			href="/"
		>
			<span>ULTIMATE</span> <img src="/favicon.png" alt="logo" class="h-8 hidden sm:inline" />
			<span>STORAGE</span>
		</a>
		<div class="flex-1 py-8 md:py-4 flex justify-center items-center md:justify-end md:items-end">
			{#if file}
				<button
					on:click|preventDefault={() => {
						if (file) filesService.downloadFile(file.id, file.originalName);
					}}
					class="text-primary-600 hover:text-primary-500 flex gap-2 text-lg font-bold"
				>
					<Download size={32} />
					<span class="block md:hidden"> Download </span>
				</button>
			{/if}
		</div>
	</div>
	<div class="max-h-fit h-full flex justify-center">
		{#if file}
			<FilePreview
				{file}
				containerClass="flex-1 flex justify-center align-center"
				access="public"
			/>
		{/if}
	</div>
</div>
