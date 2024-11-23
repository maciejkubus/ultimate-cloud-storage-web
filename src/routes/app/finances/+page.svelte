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

<div class="w-full pb-16 flex flex-col xl:flex-row items-stretch gap-16">
	<div class="w-full xl:w-2/3">
		<ExpenceAdder on:new={newExpence} />
	</div>
	<div class="none md:flex w-1/3 bg-cyan-50 rounded-lg shadow-lg" />
</div>

<ExpencesList {expences} on:remove={(e) => remove(e.detail)} />

<div class="mt-8">
	<PaginationBar data={paginationData} on:change={pageChange} />
</div>
