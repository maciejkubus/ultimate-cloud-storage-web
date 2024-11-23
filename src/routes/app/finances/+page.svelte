<script lang="ts">
	import ExpenceAdder from '$lib/components/expence-adder/expence-adder.svelte';
	import ExpencesList from '$lib/components/expences-list/expences-list.svelte';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import type { Expence } from '$lib/interfaces/expence.interface';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { ExpencesService } from '$lib/services/expences.service';
	// import { Expence } from '$lib/interfaces/expence.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	let expenceService: ExpencesService;
	let expences: Expence[] = [];
	let stats: any;
	let loading = true;
	let paginationData: Paginated = {
		page: 1,
		totalPages: 1,
		lastPage: 1,
	};

	const loadExpences = async (page: number) => {
		loading = true;
		expences = [];
		const res = await expenceService.getExpences(page);
		expences = res.data;
		paginationData.page = res.meta.currentPage;
		paginationData.totalPages = res.meta.totalPages;
		paginationData.lastPage = res.meta.totalPages;
		loading = false;
	};

	const pageChange = async (event: CustomEvent<Paginated>) => {
		loading = false;
		paginationData = event.detail;
		await loadExpences(paginationData.page);
		loading = true;
	};

	onMount(async () => {
		pageMetadataStore.set({
			title: 'Finances',
		});

		expenceService = ExpencesService.getInstance();
		stats = await expenceService.getStats();
		await loadExpences(1);
	});

	function newExpence(event: CustomEvent<any>) {
		expences = [event.detail, ...expences];
	}

	async function remove(expence: Expence) {
		if (!expence.id) return;

		await expenceService.delete(expence.id);
		loadExpences(paginationData.page);
	}
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Finances</title>
</svelte:head>

<div class="w-full pb-16 flex flex-col xl:flex-row items-stretch gap-14">
	<div class="w-full xl:w-2/3 xl:h-[411px]">
		<ExpenceAdder on:new={newExpence} />
	</div>
	<div
		class="w-full xl:w-1/3 flex flex-row xl:flex-col gap-4 items-stretch justify-between xl:h-[411px]"
	>
		<div
			class="w-1/2 xl:w-full p-4 xl:p-12 flex flex-col justify-center items-center variant-filled-secondary rounded-lg shadow-lg"
		>
			<h3 class="text-4xl font-bold">{stats ? stats.sum.toFixed(2) : ''} zł</h3>
			<p class="text-xl mt-2">twoje środki</p>
		</div>
		<a
			class="w-1/2 xl:w-full p-4 xl:p-12 flex flex-col justify-center items-center variant-filled-surface rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
			href="/finances/stats"
		>
			<h3 class="text-2xl font-bold">Your Raport</h3>
			<p class="underline">go to page</p>
		</a>
	</div>
</div>
{#if expences.length > 0}
	<ExpencesList {expences} on:remove={(e) => remove(e.detail)} />

	<div class="mt-8">
		<PaginationBar data={paginationData} on:change={pageChange} />
	</div>
{:else}
	<div class="w-full text-center pb-16">
		<h4 class="text-4xl">Nic tu nie ma</h4>
		<p class="text-2xl mt-2 opacity-75">Dodaj transakcje w formularzu powyżej</p>
	</div>
{/if}
