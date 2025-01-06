<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { formatDate } from '$lib/utils/format-date';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import EventTile from '../event-tile/event-tile.svelte';
	import { months } from '$lib/utils/months';
	import { EventsService } from '$lib/services/events.service';

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

	function displayDate(d: Date) {
		const day = d.getDate();
		const month = months[d.getMonth()];
		const year = d.getFullYear();
		let hour = d.getHours().toString();
		let minute = d.getMinutes().toString();

		if (hour.length == 1) hour = '0' + hour;
		if (minute.length == 1) minute = '0' + minute;

		return `${day < 10 ? '0' + day : day} ${month} ${year}, ${hour}:${minute}`;
	}
</script>

{#if loaded}
	<div class="variant-filled-surface p-4 xl:p-8 rounded-xl shadow-lg space-y-4">
		<div class="w-full flex gap-8 justify-between items-center">
			<button on:click={goToCalendar}> <ArrowLeft size={32} /> </button>
			<div class="text-xl text-center xl:w-[330px]">
				{(date.getDate() < 10 ? '0' + '' : '') + date.getDate()}
				{months[date.getMonth()]}
				{date.getFullYear()}
			</div>
			<div />
		</div>
		<div class="space-y-2">
			{#each events as event}
				<EventTile {event} />
			{/each}
		</div>
	</div>
{/if}
