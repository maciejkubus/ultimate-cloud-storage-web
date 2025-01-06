<script lang="ts">
	import EventCalendarMonthView from '../event-calendar-month-view/event-calendar-month-view.svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import EventCalendarDayView from '../event-calendar-day-view/event-calendar-day-view.svelte';

	export let events: Event[] = [];
	let view: 'month' | 'day' = 'month';
	let selectedDate: Date = new Date();

	function switchTo(viewToSwitch: 'month' | 'day', date?: any) {
		if (date != undefined) {
			selectedDate = new Date(date.year, date.month, date.day);
		}
		view = viewToSwitch;
	}
</script>

{#if view == 'month'}
	<EventCalendarMonthView {events} on:select={(e) => switchTo('day', e.detail)} />
{:else if view == 'day'}
	<EventCalendarDayView on:goToCalendar={(e) => switchTo('month')} date={selectedDate} />
{/if}
