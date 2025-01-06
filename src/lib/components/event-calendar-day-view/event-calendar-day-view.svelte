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
	});

	function goToCalendar() {
		dispatch('goToCalendar');
	}
</script>

{#if loaded}
	<div class="variant-filled-surface py-4 xl:py-8 rounded-xl shadow-lg space-y-4">
		<div class="w-full flex gap-8 justify-between items-center px-4 xl:px-8">
			<button on:click={goToCalendar}> <ArrowLeft size={32} /> </button>
			<div class="text-xl text-center xl:w-[330px]">
				{(date.getDate() < 10 ? '0' + '' : '') + date.getDate()}
				{months[date.getMonth()]}
				{date.getFullYear()}
			</div>
			<div />
		</div>
		<div class="pt-4">
			{#each events as event, index}
				<EventTile {event} region={index % 2 == 1 ? 'bg-surface-700' : 'bg-surface-900'} />
			{/each}
		</div>
	</div>
{/if}
