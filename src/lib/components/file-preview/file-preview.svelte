<script lang="ts">
	import type { File } from '$lib/interfaces/file.interface';
	import { onMount } from 'svelte';
	import FolderOff from 'carbon-icons-svelte/lib/FolderOff.svelte';
	import { createAccesibleFile } from '$lib/utils/create-accesible-file';
	import { FileType } from '$lib/enums/file-type.enum';

	export let imageClass = '';
	export let videoClass = '';
	export let audioClass = '';
	export let containerClass = '';
	export let noPreviewClass = '';
	export let file: File | null = null;
	let type: FileType = FileType.FILE;
	let src = '';
	let alt = '';

	onMount(async () => {
		if (!file) return;
		const accesibleFile = await createAccesibleFile(file);

		type = accesibleFile.type;
		src = accesibleFile.src;
		alt = accesibleFile.alt;
	});
</script>

{#if file}
	<div class={containerClass}>
		{#if type === FileType.IMAGE}
			<img {src} {alt} class={imageClass} />
		{:else if type === FileType.VIDEO}
			<video {src} class={videoClass} controls>
				<track kind="captions" />
			</video>
		{:else if type === FileType.AUDIO}
			<audio {src} class={audioClass} controls />
		{:else if $$slots.default}
			<slot />
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
{/if}
