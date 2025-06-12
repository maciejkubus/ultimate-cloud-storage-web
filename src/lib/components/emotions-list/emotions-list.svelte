<script lang="ts">
	import { EmotionsService } from '$lib/services/emotions.service';
	import { onMount } from 'svelte';
	import EmotionCreator from '../emotion-creator/emotion-creator.svelte';
	import type { Emotion } from '$lib/interfaces/emotion.interface';
	import { emotionsStore } from '$lib/stores/emotions.store';

	let emotionsService: EmotionsService | null = null;
	let emotions: Emotion[] | any = [];

	onMount(async () => {
		emotionsService = EmotionsService.getInstance();
		emotions = await emotionsService.getEmotions();
		emotionsStore.set(emotions);
	});

	const emotionCreated = (e: { detail: Emotion }) => {
		emotions = [...emotions, e.detail];
	};

	const remove = async (id: number) => {
		await emotionsService?.delete(id);
		emotions = [];
		emotions = await emotionsService?.getEmotions();
	};
</script>

<div class="w-full lg:w-1/4 flex flex-col justify-stretch items-stretch gap-8">
	<div class="w-full">
		<EmotionCreator on:created={emotionCreated} />
	</div>
	<div class="w-full">
		<div class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-4">
			<h3 class="text-3xl">Your emotions!</h3>
			<div
				class="flex flex-row flex-wrap lg:flex-col lg:flex-nowrap justify-start items-start text-xl gap-4 mt-2"
			>
				{#each emotions as emotion}
					<button
						type="button"
						class="flex flex-row justify-center items-center gap-1 p-2 relative rounded-xl overflow-hidden"
					>
						<span class="text-lg lg:text-2xl">{emotion.emoticon}</span>
						{emotion.name}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="absolute opacity-0 hover:opacity-90 scale-150 hover:scale-100 duration-200 transition-all ease-in-out inset-0 bg-error-500 flex justify-center items-center text-lg"
							on:click={() => remove(emotion.id)}
						>
							Remove
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
