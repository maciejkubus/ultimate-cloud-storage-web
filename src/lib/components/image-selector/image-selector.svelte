<script lang="ts">
	import type { AccesibleFile } from '$lib/interfaces/accesible-file.interface';
	import type { File } from '$lib/interfaces/file.interface';
	import { createEventDispatcher } from 'svelte';
	import FilePreview from '../file-preview/file-preview.svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';

	export let images: File[] = [];
	let selected: File | null = null;

	const dispatch = createEventDispatcher();

	const select = (image: File) => {
		selected = image;
		dispatch('select', selected);
	};
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
	{#each images as image}
		<div
			class="relative aspect-square overflow-hidden border-primary-500 border-2 rounded-xl"
			class:border-secondary-500={selected && selected.id === image.id}
		>
			<FilePreview
				file={image}
				imageClass="aspect-square object-cover"
				containerClass="pointer-events-none"
			/>
			<button
				class="absolute inset-0 bg-surface-500 bg-opacity-0 text-primary-500 flex items-center justify-center text-secondary-500 transition-all {selected &&
				selected.id === image.id
					? 'bg-opacity-75'
					: ''}"
				on:click|stopPropagation|preventDefault={() => select(image)}
			>
				<div
					class="scale-150 transition-all opacity-0 {selected && selected.id === image.id
						? 'opacity-100'
						: ''}"
				>
					<span class="scale-150"> <Checkmark size={32} /> </span>
				</div>
			</button>
		</div>
	{/each}
</div>
