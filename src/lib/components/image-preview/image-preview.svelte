<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import { FilesService } from '$lib/services/files.service';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';

	const filesService = FilesService.getInstance();

	export let file: File | null = null;
	let src = '';
	let alt = '';
	let type: 'image' | 'video' | 'audio' | 'file' = 'file';

	onMount(async () => {
		const blob = await filesService.getFileBlob(file?.id || 0, file?.originalName || '');
		const URLObject = URL.createObjectURL(blob);

		if (file?.mimetype?.includes('image')) type = 'image';
		else if (file?.mimetype?.includes('video')) type = 'video';
		else if (file?.mimetype?.includes('audio')) type = 'audio';

		alt = file?.originalName || '';
		src = URLObject;
	});
</script>

<div class="">
	{#if type === 'image'}
		<img {src} {alt} class="max-w-screen max-h-screen p-8 pointer-events-none" />
	{:else if type === 'video'}
		<video {src} class="max-w-screen max-h-screen p-8" controls>
			<track kind="captions" />
		</video>
	{:else if type === 'audio'}
		<audio {src} class="" controls />
	{:else}
		<div class="flex flex-col items-center justify-center max-w-screen max-h-screen p-8">
			<div class="flex flex-col items-center justify-center">
				<div class="flex items-center justify-center">
					<span class="text-gray-400">
						<FolderOff size={32} />
					</span>
				</div>
				<div class="mt-4 text-gray-400">No preview available</div>
			</div>
		</div>
	{/if}
</div>
