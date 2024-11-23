<script lang="ts">
	import ExpenceAdder from '$lib/components/expence-adder/expence-adder.svelte';
	import { Expence } from '$lib/interfaces/expence.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	onMount(() => {
		pageMetadataStore.set({
			title: 'Finances',
		});
	});

	function newExpence(event: CustomEvent<Expence>) {
		console.log(event.detail);
	}
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Finances</title>
</svelte:head>

<div class="w-full pb-16 flex flex-col lg:flex-row items-stretch gap-16">
	<div class="w-full lg:w-2/3">
		<ExpenceAdder />
	</div>
	<div class="none md:flex w-1/3 bg-cyan-50 rounded-lg shadow-lg" />
</div>
