<script lang="ts">
	import { onMount } from 'svelte';
	import { months } from '$lib/utils/months';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import type { Expence } from '$lib/interfaces/expence.interface';
	import { ExpencesService } from '$lib/services/expences.service';
	import ExpencesList from '../expences-list/expences-list.svelte';
	import PaginationBar from '../pagination-bar/pagination-bar.svelte';

	export let chart: any;

	let expenceService: ExpencesService;
	let expences: Expence[] = [];
	let expensesLoading = true;
	let expensesDate = ''; //YYYY-MM
	let paginationData: Paginated = {
		page: 1,
		totalPages: 1,
		lastPage: 1,
	};

	const loadExpences = async (page: number) => {
		expensesLoading = true;
		expences = [];
		const res = await expenceService.getExpencesInMonth(page, expensesDate);
		expences = res.data;
		paginationData.page = res.meta.currentPage;
		paginationData.totalPages = res.meta.totalPages;
		paginationData.lastPage = res.meta.totalPages;
		expensesLoading = false;
	};

	const pageChange = async (event: CustomEvent<Paginated>) => {
		expensesLoading = false;
		paginationData = event.detail;
		await loadExpences(paginationData.page);
		expensesLoading = true;
	};

	const changeDate = async (date: string) => {
		expensesDate = date;
		await loadExpences(1);
	};

	let data: any[] = [];
	let loading = true;
	const sum = {
		income: 0,
		outcome: 0,
	};
	let largestCome = 0;

	onMount(() => {
		expenceService = ExpencesService.getInstance();

		for (const monthKey in chart) {
			const raw = monthKey.split('-');
			const year = raw[0];
			const month = months[parseInt(raw[1]) - 1];
			data.push({
				year: parseInt(year),
				month,
				monthNum: raw[1],
				income: chart[monthKey].income,
				outcome: chart[monthKey].outcome,
			});
		}
		data = data.splice(6, 11);
		for (const item of data) {
			sum.income += item.income;
			sum.outcome += item.outcome;

			if (item.income > largestCome) largestCome = item.income;
			if (item.outcome > largestCome) largestCome = item.outcome;
		}
		loading = false;
	});

	function getBarHeight(money: number) {
		const percentege = (money / largestCome) * 100;
		const height = percentege * 3;
		console.log({ money, percentege, height });
		return height;
	}
</script>

{#if !loading}
	<div class="hidden lg:block variant-filled-primary p-8 rounded-lg space-y-8">
		<div class="w-full flex justify-between items-center">
			<div class="text-2xl font-bold">Summary of last 6 months:</div>
			<div class="text-right font-semibold">
				<div>Income: {sum.income.toFixed(2)} zł</div>
				<div>Outcome: {sum.outcome.toFixed(2)} zł</div>
			</div>
		</div>
		<div class="flex min-h-[300px]">
			{#each data as item}
				<div class="w-full flex flex-col justify-end items-center">
					<div class="w-full flex justify-center items-end gap-1">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="bg-success-600 w-12 border-b-8 border-success-700 shadow-outline shadow-success-500 tooltip-host cursor-pointer"
							style="height: {getBarHeight(item.income)}px"
							on:click={() => changeDate(item.year + '-' + item.monthNum)}
						>
							<div class="tooltip variant-filled-secondary px-2 py-1 rounded-lg text-sm">
								<span class="text-xs">Income</span> <br />
								{item.income.toFixed(2)}
							</div>
						</div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="bg-rose-600 w-12 border-b-8 border-rose-700 shadow-outline shadow-rose-500 tooltip-host cursor-pointer"
							style="height: {getBarHeight(item.outcome)}px"
							on:click={() => changeDate(item.year + '-' + item.monthNum)}
						>
							<div class="tooltip variant-filled-secondary px-2 py-1 rounded-lg text-sm">
								<span class="text-xs">Outcome</span> <br />
								{item.outcome.toFixed(2)}
							</div>
						</div>
					</div>
					<div
						class="w-full flex flex-col items-center pt-4 border-t-2 border-dashed border-surface-500"
					>
						<div class="font-bold">{item.month}</div>
						<div class="text-sm">{item.year}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
<div class="w-full pt-16 min-h-[400px]">
	{#if expences.length > 0}
		<ExpencesList {expences} hideRemoveBtn={true} />
		<div class="mt-8">
			<PaginationBar data={paginationData} on:change={pageChange} />
		</div>
	{/if}
</div>
