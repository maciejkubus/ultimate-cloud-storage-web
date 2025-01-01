<script lang="ts">
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import CalendarHeatMap from 'carbon-icons-svelte/lib/CalendarHeatMap.svelte';
	import DatePickerCalendar from '../date-picker-calendar/date-picker-calendar.svelte';
	import { months } from '$lib/utils/months';
	import { weekDays } from '$lib/utils/week-days';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { CalendarPickerResponse } from '$lib/interfaces/calendar-picker-response.interface';
	import { type ModalComponent, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import { EventsService } from '$lib/services/events.service';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';

	export let color = '#000000';
	export let start: string;
	export let id: number;
	export let name: string;

	const dispatch = createEventDispatcher();
	let eventService: EventsService;
	let date: Date = new Date();
	let displayDate = '';

	onMount(() => {
		date = new Date(start);
		updateDisplayDate();

		eventService = EventsService.getInstance();
	});

	function updateDisplayDate() {
		displayDate = `${weekDays[date.getDay()]}, ${
			date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
		}
    ${months[date.getMonth()]} ${date.getFullYear()}`;
	}

	function remove() {
		dispatch('remove', id);
	}

	const modalComponentDate: ModalComponent = {
		ref: DatePickerCalendar,
		props: {
			date,
		},
	};
	const modalDate: ModalSettings = {
		type: 'component',
		component: modalComponentDate,
		response: async (response: CalendarPickerResponse) => {
			if (!response) return;

			date.setDate(response.day);
			date.setMonth(response.month);
			date.setFullYear(response.year);

			await eventService.update(id, {
				start: date.toISOString(),
			});

			updateDisplayDate();
		},
	};

	const modalName: ModalSettings = {
		type: 'prompt',
		title: 'Task Name',
		body: 'Provide new name for task',
		value: name,
		valueAttr: { type: 'text', minlength: 1, maxlength: 50, required: true },
		response: async (res: string) => {
			if (!res) return;
			await eventService.update(id, {
				name: res,
			});
			name = res;
		},
	};
</script>

<div
	class="variant-filled-surface rounded-lg p-4 shadow-lg border-l-8 flex gap-4 justify-between items-end"
	style="border-color: {color};"
>
	<div>
		<h4 class="text-xl mb-1">
			{name}
		</h4>
		<div class="text-primary-600">
			{displayDate}
		</div>
	</div>
	<div class="flex gap-4">
		<button
			class="transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
			on:click={() => modalStore.trigger(modalName)}
		>
			<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">Change name</div>
			<Edit size={20} />
		</button>
		<button
			class="transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
			on:click={() => modalStore.trigger(modalDate)}
		>
			<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">Change date</div>
			<CalendarHeatMap size={20} />
		</button>
		<button
			class="transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
			on:click={remove}
		>
			<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">Remove</div>
			<TrashCan size={20} />
		</button>
	</div>
</div>
