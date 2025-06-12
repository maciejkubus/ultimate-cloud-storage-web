<script lang="ts">
	import type { Emotion } from '$lib/interfaces/emotion.interface';
	import { EmotionsService } from '$lib/services/emotions.service';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	let emotionsService: EmotionsService | null = null;
	let emotions: Emotion[] = [];
	let selectedIds: number[] = [];

	onMount(async () => {
		emotionsService = EmotionsService.getInstance();
		emotions = await emotionsService.getEmotions();
	});

	const toggle = (id: number) => {
		const index = selectedIds.indexOf(id);
		if (index > -1) {
			selectedIds.splice(index, 1);
		} else {
			selectedIds.push(id);
		}
		selectedIds = [...selectedIds];

		dispatch('change', selectedIds);
	};
</script>

<div class="w-full flex flex-wrap gap-2">
	{#each emotions as emotion}
		<button
			type="button"
			class="flex flex-row justify-center items-center gap-1 py-1 px-2 relative rounded-xl overflow-hidden border-2 border-solid border-slate-700 bg-slate-700 bg-opacity-50 {selectedIds.indexOf(
				emotion.id,
			) > -1
				? 'bg-emerald-200 bg-opacity-0 border-emerald-700 shadow-lg'
				: ''}"
			on:click={() => toggle(emotion.id)}
		>
			<span class="lg:text-lg">{emotion.emoticon}</span>
			{emotion.name}
		</button>
	{/each}
</div>
