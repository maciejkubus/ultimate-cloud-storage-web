<script lang="ts">
	import type { Expence } from '$lib/interfaces/expence.interface';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { openModalPreview } from '$lib/utils/open-modal-preview';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let expences: Expence[] = [];
	const dispatch = createEventDispatcher();
	const formatDate = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString();
		return date;
	};

	function openModalRemove(expence: Expence) {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove transaction?',
			body:
				'Remove transaction ' +
				expence.name +
				' (' +
				formatDate(expence.created ? expence.created : '') +
				')?',
			response: async (response: boolean) => {
				if (!response) return;
				dispatch('remove', expence);
			},
		});
	}
</script>

<div class="w-full variant-filled-surface rounded-lg overflow-hidden">
	{#each expences as expence, index}
		<div
			class="w-full flex flex-col xl:flex-row px-8 py-4 xl:gap-8 xl:justify-center xl:items-center
              {index % 2 == 1 ? 'bg-surface-700' : ''}
              {index == 0 ? 'pt-8' : ''}
              {index == expences.length - 1 ? 'pb-4' : ''}
      "
		>
			<div class="flex flex-col xl:gap-2 xl:justify-center xl:items-center">
				<div class="xl:text-2xl font-bold">{expence.amount} zł</div>
				<div class="text-xs xl:text-base">
					{formatDate(expence.created ? expence.created : '')}
				</div>
			</div>
			<div class="flex flex-col gap-1 xl:gap-2 w-full pt-4 xl:pt-0">
				<h4 class="text-lg xl:text-xl font-bold">{expence.name}</h4>
				{#if expence.description}
					<p class="text-sm xl:text-base">{expence.description}</p>
				{/if}
			</div>
			<div class="flex justify-end pt-4 xl:pt-0">
				<button
					on:click|stopPropagation|preventDefault={() => openModalRemove(expence)}
					class="text-primary-600 hover:text-primary-500"
				>
					<TrashCan size={20} />
				</button>
			</div>
		</div>
	{/each}
</div>
