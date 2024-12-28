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
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { userStore } from '$lib/stores/user.store';

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});

	let expenceService: ExpencesService;
	let expences: Expence[] = [];
	let stats: any;
	let loading = true;

	onMount(async () => {
		pageMetadataStore.set({
			title: 'Finances - Stats',
		});

		expenceService = ExpencesService.getInstance();
		stats = await expenceService.getStats();
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Finances</title>
</svelte:head>

<div class="w-full pb-16 flex flex-col xl:flex-row items-stretch gap-14">
	<div
		class="w-full xl:w-2/3 xl:h-[411px] variant-filled-surface flex flex-col justify-center items-center gap-4 p-8 rounded-lg shadow-lg"
	>
		<h2 class="text-2xl xl:text-4xl font-bold">Your financial raport</h2>
		<p class="text-lg xl:text-2xl text-slate-400 italic">generated for {user.user.username}</p>
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
			href="/app/finances"
		>
			<h3 class="text-2xl font-bold">Your finances</h3>
			<p class="underline">go back</p>
		</a>
	</div>
</div>
