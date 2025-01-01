<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let colors: string[] = [];
	export let value: string;

	const dispatch = createEventDispatcher();

	function change(color: string) {
		dispatch('change', color);
	}
</script>

<div class="w-full grid grid-cols-6 gap-4 items-center justify-between">
	{#each colors as color}
		<button
			class="w-12 xl:w-6 h-12 xl:h-6 shadow-lg mx-auto rounded-full hover:scale-125 transition-all duration-150 ease-in-out
       border-4 border-transparent {color == value ? '!border-primary-500' : ''}"
			style="background-color: {color};"
			type="button"
			on:click={() => change(color)}
		/>
	{/each}
</div>
