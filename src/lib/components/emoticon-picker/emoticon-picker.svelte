<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { randomFromArray } from '$lib/utils/random-from-array';
	import { basicEmojiList } from '$lib/utils/basic-emoji-list';

	const dispatch = createEventDispatcher();
	let value = '';
	let open = false;

	onMount(() => {
		change(randomFromArray(basicEmojiList));
	});

	const change = (v: string) => {
		value = v;
		open = false;
		dispatch('change', value);
	};
</script>

<div class="relative">
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div
		class="mt-4 mr-4 text-4xl hover:scale-110 hover:-rotate-6 transition-all duration-200 cursor-pointer"
		on:mouseover={() => (open = true)}
	>
		{value}
	</div>
	<div
		class="absolute {open
			? 'opacity-100 h-auto'
			: 'opacity-0 h-0'}  -top-2 md:top-3/4 -left-2 w-48 z-40 overflow-y-scroll bg-primary-800 rounded-lg shadow-lg transition-opacity duration-300"
		on:mouseleave={() => (open = false)}
	>
		<div class="grid grid-cols-5 gap-1 text-xl p-1 justify-center items-center">
			{#each basicEmojiList as emoji}
				<button
					class="text-center w-full cursor-pointer hover:scale-150 transition-all duration-100 select-none"
					on:click={() => change(emoji)}
					type="button"
				>
					{emoji}
				</button>
			{/each}
		</div>
	</div>
</div>
