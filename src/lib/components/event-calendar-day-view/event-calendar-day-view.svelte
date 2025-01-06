<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { formatDate } from '$lib/utils/format-date';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { months } from '$lib/utils/months';
	import { EventsService } from '$lib/services/events.service';
	import EventTile from '../event-tile/event-tile.svelte';

	const dispatch = createEventDispatcher();
	const eventsService = EventsService.getInstance();
	export let date: any;
	let events: Event[] = [];
	let loaded = false;

	onMount(async () => {
		loadEvents();
	});

	async function loadEvents() {
		loaded = false;
		events = [];
		events = await eventsService.getEvents();
		events = events
			.filter((e) => e.type == 'event')
			.filter((e) => {
				const eDate = new Date(e.start);
				return (
					eDate.getDate() == date.getDate() &&
					eDate.getMonth() == date.getMonth() &&
					eDate.getFullYear() == date.getFullYear()
				);
			});
		loaded = true;
	}

	function goToCalendar() {
		dispatch('goToCalendar');
	}
</script>

{#if loaded}
	<div class="py-4 xl:py-8 space-y-8">
		<div
			class="w-full flex gap-8 justify-between items-center p-4 xl:p-8 variant-filled-surface rounded-xl shadow-lg"
		>
			<button on:click={goToCalendar} class="tooltip-host">
				<div class="tooltip variant-filled-secondary p-2 pb-1 rounded-lg text-sm">Back</div>
				<ArrowLeft size={32} />
			</button>
			<div class="text-xl text-center xl:w-[330px]">
				{(date.getDate() < 10 ? '0' + '' : '') + date.getDate()}
				{months[date.getMonth()]}
				{date.getFullYear()}
			</div>
			<div />
		</div>
		<div class="">
			{#each events as event}
				<EventTile {event} on:refresh={loadEvents} />
			{/each}
		</div>
	</div>
{/if}
