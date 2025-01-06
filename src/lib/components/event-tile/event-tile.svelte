<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { months } from '$lib/utils/months';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import CalendarHeatMap from 'carbon-icons-svelte/lib/CalendarHeatMap.svelte';
	import DatePickerCalendar from '../date-picker-calendar/date-picker-calendar.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { EventsService } from '$lib/services/events.service';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { Edit } from 'carbon-icons-svelte';
	import type { CalendarPickerResponse } from '$lib/interfaces/calendar-picker-response.interface';
	import { date } from 'yup';

	export let event: Event;
	const dispatch = createEventDispatcher();
	let eventService: EventsService;

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

	onMount(() => {
		eventService = EventsService.getInstance();
	});

	async function remove() {
		if (!event.id) return;

		eventService.delete(event.id);
		dispatch('refresh');
	}

	const modalName: ModalSettings = {
		type: 'prompt',
		title: 'Event Name',
		body: 'Provide new name',
		value: event.name,
		valueAttr: { type: 'text', minlength: 1, maxlength: 50, required: true },
		response: async (res: string) => {
			if (!res) return;
			await eventService.update(event.id ? event.id : 0, {
				name: res,
			});
			dispatch('refresh');
		},
	};

	const modalDescription: ModalSettings = {
		type: 'prompt',
		title: 'Event Description',
		body: 'Provide new description',
		value: event.description ? event.description : '',
		valueAttr: { type: 'text', minlength: 1, maxlength: 50, required: true },
		response: async (res: string) => {
			if (!res) return;
			await eventService.update(event.id ? event.id : 0, {
				description: res,
			});
			dispatch('refresh');
		},
	};

	const modalComponentStartDate: ModalComponent = {
		ref: DatePickerCalendar,
		props: {
			date: new Date(event.start),
		},
	};
	const modalStartDate: ModalSettings = {
		type: 'component',
		component: modalComponentStartDate,
		response: async (response: CalendarPickerResponse) => {
			if (!response) return;

			let startDate = new Date(event.start);
			startDate.setDate(response.day);
			startDate.setMonth(response.month);
			startDate.setFullYear(response.year);
			startDate.setHours(response.hour ? response.hour : 0);
			startDate.setMinutes(response.minute ? response.minute : 0);
			console.log(event.start, response);

			await eventService.update(event.id ? event.id : 0, {
				start: startDate.toISOString(),
			});
			dispatch('refresh');
		},
	};

	const modalComponentEndDate: ModalComponent = {
		ref: DatePickerCalendar,
		props: {
			date: new Date(event.end ? event.end : ''),
		},
	};
	const modalEndDate: ModalSettings = {
		type: 'component',
		component: modalComponentEndDate,
		response: async (response: CalendarPickerResponse) => {
			if (!response) return;

			let endDate = new Date(event.end ? event.end : '');
			endDate.setDate(response.day);
			endDate.setMonth(response.month);
			endDate.setFullYear(response.year);
			endDate.setHours(response.hour ? response.hour : 0);
			endDate.setMinutes(response.minute ? response.minute : 0);

			await eventService.update(event.id ? event.id : 0, {
				end: endDate.toISOString(),
			});
			dispatch('refresh');
		},
	};
</script>

<div
	class="w-full pr-4 xl:pr-8 pl-8 xl:pl-10 py-4 space-y-2 relative variant-filled-surface rounded-xl shadow-lg mb-4 group"
>
	<div
		class="absolute top-0 left-0 h-full w-2 xl:w-4 animate-pulse rounded-l-xl"
		style="background-color: {event.color};"
	/>
	<div class="flex flex-col xl:flex-row gap-2 xl:justify-between">
		<div class="text-2xl group">
			{event.name}
			<button
				class="opacity-0 group-hover:opacity-50 inline transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
				on:click={() => modalStore.trigger(modalName)}
			>
				<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">Change name</div>
				<Edit size={20} />
			</button>
		</div>
		<div class="xl:w-[300px] text-right text-gray-300">
			<div>
				From: {displayDate(new Date(event.start))}
				<button
					class="opacity-0 group-hover:opacity-50 transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
					on:click={() => modalStore.trigger(modalStartDate)}
				>
					<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">
						Change date
					</div>
					<CalendarHeatMap size={20} />
				</button>
			</div>
			{#if event.end}
				<div>
					To: {displayDate(new Date(event.end))}
					<button
						class="opacity-0 group-hover:opacity-50 transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
						on:click={() => modalStore.trigger(modalEndDate)}
					>
						<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">
							Change date
						</div>
						<CalendarHeatMap size={20} />
					</button>
				</div>
			{/if}
		</div>
	</div>
	<div class="flex gap-4">
		<div
			class="text-gray-300 text-lg w-full group
      {event.description && event.description.length > 0 ? '' : 'italic'}"
		>
			{event.description && event.description.length > 0 ? event.description : 'No description.'}
			<button
				class="opacity-0 group-hover:opacity-50 inline transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
				on:click={() => modalStore.trigger(modalDescription)}
			>
				<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">
					Change description
				</div>
				<Edit size={20} />
			</button>
		</div>
		<button
			class="opacity-0 group-hover:opacity-100 transition-all duration-100 ease-in-out hover:scale-125 tooltip-host"
			on:click={remove}
		>
			<div class="tooltip variant-filled-secondary px-2 pb-1 rounded-lg text-xs">Remove</div>
			<TrashCan size={20} />
		</button>
	</div>
</div>
