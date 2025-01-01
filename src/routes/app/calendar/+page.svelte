<script lang="ts">
	import ExpenceAdder from '$lib/components/expence-adder/expence-adder.svelte';
	import ExpencesList from '$lib/components/expences-list/expences-list.svelte';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import TaskCreator from '$lib/components/task-creator/task-creator.svelte';
	import TaskList from '$lib/components/task-list/task-list.svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import type { Expence } from '$lib/interfaces/expence.interface';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { EventsService } from '$lib/services/events.service';
	import { ExpencesService } from '$lib/services/expences.service';
	// import { Expence } from '$lib/interfaces/expence.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { months } from '$lib/utils/months';
	import { onMount } from 'svelte';

	let eventsService: EventsService | null = null;
	let loading = true;

	const tasks: Event[] = [];
	const events: Event[] = [];
	const date = {
		year: 2000,
		month: 1,
	};

	onMount(async () => {
		pageMetadataStore.set({
			title: 'Calendar',
		});
		const now = new Date();
		date.year = now.getUTCFullYear();
		date.month = now.getMonth() + 1;

		eventsService = EventsService.getInstance();
		const data = await eventsService.getEvents(date.year, date.month);
		for (const item of data) {
			if (item.type == 'event') events.push(item);
			else if (item.type == 'task') tasks.push(item);
		}

		loading = false;
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Calendar</title>
</svelte:head>

<div class="w-full py-8 flex flex-col xl:flex-row gap-8">
	<div class="w-full xl:w-1/3">
		<TaskList>
			<TaskCreator slot="header" />
		</TaskList>
	</div>
	<div class="w-full xl:w-2/3">.</div>
</div>
