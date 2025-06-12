<script lang="ts">
	import type { EmotionCheck } from '$lib/interfaces/emotion-check.interface';
	import { createEventDispatcher, onMount } from 'svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

	export let emotionCheck: EmotionCheck;

	const dispatch = createEventDispatcher();
	console.log(emotionCheck.emotions);
</script>

<div class="group w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-8">
	<div class="flex flex-row justify-between items-end gap-4 font-bold">
		<div class="text-xl lg:text-2xl">
			{emotionCheck.date?.toLocaleString('pl-PL', {
				hour: '2-digit',
				minute: '2-digit',
			})} - {emotionCheck.date?.toLocaleString('pl-PL', {
				weekday: 'long',
			})}
		</div>
		<div class="text-2xl lg:text-4xl">
			{emotionCheck.date?.toLocaleString('pl-PL', {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
			})}
		</div>
	</div>
	<div class="flex flex-row flex-wrap justify-start items-start text-xl gap-4 mt-2">
		{#each emotionCheck.emotions as emotion}
			<div
				class="flex flex-row justify-center items-center gap-1 px-2 relative rounded-xl overflow-hidden"
			>
				<span class="text-lg lg:text-2xl">{emotion.emoticon}</span>
				{emotion.name}
			</div>
		{/each}
	</div>
	<div class="w-full flex flex-row justify-end">
		<button
			on:click={() => dispatch('remove', emotionCheck.id)}
			class="text-primary-600 hover:text-primary-500 opacity-0 group-hover:opacity-100 duration-100 transition-all"
		>
			<TrashCan size={24} />
		</button>
	</div>
</div>
