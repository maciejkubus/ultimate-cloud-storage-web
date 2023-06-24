<script lang="ts">
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let data: Paginated;
	const dispatch = createEventDispatcher();
	let page: number = 1;

	onMount(() => {
		page = data.page;
	});

	const change = (changePage: number) => {
		if (changePage < 1 || changePage > data.totalPages) {
			page = data.page;
			return;
		}

		page = changePage;
		const eventData: Paginated = {
			...data,
			page,
		};
		dispatch('change', eventData);
	};
</script>

<div class="w-full flex justify-center items-center">
	<button
		class="btn btn-primary variant-filled-secondary"
		disabled={data.page === 1}
		on:click={() => change(data.page - 1)}
	>
		<ArrowLeft size={24} />
	</button>
	<span class="mx-4">
		<input
			type="number"
			bind:value={page}
			class="p-0 m-0 bg-transparent border-0 border-b-2 outline-none text-center w-6"
			on:change={() => change(page)}
		/>
		<span class="w-4 text-center inline-block"> / </span>
		<span class=""> {data.totalPages} </span>
	</span>
	<button
		class="btn btn-primary variant-filled-secondary"
		disabled={data.page === data.totalPages}
		on:click={() => change(data.page + 1)}
	>
		<ArrowRight size={24} />
	</button>
</div>
