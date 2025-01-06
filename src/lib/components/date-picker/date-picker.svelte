<script lang="ts">
	import CalendarHeatMap from 'carbon-icons-svelte/lib/CalendarHeatMap.svelte';
	import { formatDate } from '$lib/utils/format-date';
	import { months } from '$lib/utils/months';
	import { createEventDispatcher, onMount } from 'svelte';
	import DatePickerCalendar from '../date-picker-calendar/date-picker-calendar.svelte';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { CalendarPickerResponse } from '$lib/interfaces/calendar-picker-response.interface';

	export let style = '';
	const dispatch = createEventDispatcher();
	export let date: Date = new Date();
	let displayDate = '';

	function updateDisplayDate() {
		// if (date == undefined) date = new Date();
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		let hour = date.getHours().toString();
		let minute = date.getMinutes().toString();

		if (hour.length == 1) hour = '0' + hour;
		if (minute.length == 1) minute = '0' + minute;

		displayDate = `${day < 10 ? '0' + day : day} ${month} ${year}, ${hour}:${minute}`;
	}

	$: updateDisplayDate();

	onMount(() => {
		updateDisplayDate();
	});

	let modalOpen = false;
	const modalComponent: ModalComponent = {
		ref: DatePickerCalendar,
		props: {
			date,
		},
	};
	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		response: async (response: CalendarPickerResponse) => {
			if (!response) return;

			const newDate = new Date(response + '');

			date.setDate(newDate.getDate());
			date.setMonth(newDate.getMonth());
			date.setFullYear(newDate.getFullYear());
			modalOpen = false;
			updateDisplayDate();
			dispatch('change', date);
		},
	};

	function openModal() {
		if (!modalOpen) modalStore.trigger(modal);

		modalOpen = !modalOpen;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="px-4 py-2 variant-filled-secondary flex justify-center xl:justify-start items-center gap-2 rounded-xl shadow-lg cursor-pointer hover:bg-secondary-700 transition-all duration-150 ease-in-out {modalOpen
		? 'bg-secondary-900'
		: ''}"
	{style}
	on:click={openModal}
>
	<CalendarHeatMap size={24} />
	<div>{displayDate}</div>
</div>
