<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';
	import { createAccesibleFile } from '$lib/utils/create-accesible-file';
	import { FileType } from '$lib/enums/file-type.enum';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';

	export let access: 'private' | 'public' = 'private';
	export let imageClass = '';
	export let videoClass = '';
	export let audioClass = '';
	export let containerClass = '';
	export let noPreviewClass = '';
	export let file: File | null = null;
	export let videoControls = true;
	let type: FileType = FileType.FILE;
	let src = '';
	let alt = '';
	let loaded = false;

	onMount(async () => {
		if (!file) return;
		const accesibleFile = await createAccesibleFile(file, access);

		type = accesibleFile.type;
		src = accesibleFile.src;
		alt = accesibleFile.alt;
		loaded = true;
	});
</script>

{#if file && loaded}
	<div class={containerClass}>
		{#if type === FileType.IMAGE}
			<img {src} {alt} class={imageClass} />
		{:else if type === FileType.VIDEO}
			<video {src} class={videoClass} controls={videoControls}>
				<track kind="captions" />
			</video>
		{:else if type === FileType.AUDIO}
			<audio {src} class={audioClass} controls />
		{:else}
			<div class="flex flex-col items-center justify-center {noPreviewClass}">
				<div class="flex items-center justify-center">
					<span class="text-gray-400">
						<FolderOff size={32} />
					</span>
				</div>
				<div class="mt-4 text-gray-400">No preview available</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="variant-filled-secondary flex justify-center items-center {containerClass}">
		<div class="animate-spin">
			<CircleDash size={32} />
		</div>
	</div>
{/if}
