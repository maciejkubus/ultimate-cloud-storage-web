<script lang="ts">
	import ExpenceAdder from '$lib/components/expence-adder/expence-adder.svelte';
	import ExpencesList from '$lib/components/expences-list/expences-list.svelte';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import EventCreator from '$lib/components/event-creator/event-creator.svelte';
	import TaskList from '$lib/components/task-list/task-list.svelte';
	import TaskTile from '$lib/components/task-tile/task-tile.svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import type { Expence } from '$lib/interfaces/expence.interface';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { EventsService } from '$lib/services/events.service';
	import { ExpencesService } from '$lib/services/expences.service';
	// import { Expence } from '$lib/interfaces/expence.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { months } from '$lib/utils/months';
	import { onMount } from 'svelte';
	import EventCalendar from '$lib/components/event-calendar/event-calendar.svelte';

	let eventsService: EventsService | null = null;
	let loading = true;

	let tasks: Event[] = [];
	let events: Event[] = [];
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

		await getEvents();
		loading = false;
	});

	async function getEvents() {
		tasks = [];
		events = [];
		eventsService = EventsService.getInstance();
		const data = await eventsService.getEvents();
		for (const item of data) {
			if (item.type == 'event') events = [...events, item];
			else if (item.type == 'task') tasks = [...tasks, item];
		}
	}

	async function remove(event: any) {
		loading = true;
		await eventsService?.delete(event.detail);
		await getEvents();
		loading = false;
	}
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Calendar</title>
</svelte:head>

<div class="w-full py-8 flex flex-col xl:flex-row gap-8">
	<div class="w-full xl:w-1/3">
		<TaskList>
			<EventCreator slot="header" on:created={getEvents}>Add task</EventCreator>
			<div slot="list" class="flex flex-col gap-4">
				{#each tasks as task}
					<TaskTile
						color={task.color}
						start={task.start}
						id={task.id ? task.id : 0}
						name={task.name}
						on:remove={remove}
					/>
				{/each}
			</div>
		</TaskList>
	</div>
	<div class="w-full xl:w-2/3 space-y-4">
		<EventCreator on:created={getEvents} createEvent={true}>Add event</EventCreator>
		<EventCalendar {events} />
	</div>
</div>
