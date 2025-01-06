<script lang="ts">
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import {
		Autocomplete,
		modalStore,
		popup,
		toastStore,
		type PopupSettings,
	} from '@skeletonlabs/skeleton';
	import { months } from '$lib/utils/months';
	import { createEventDispatcher, onMount } from 'svelte';
	import { range } from '$lib/utils/range';
	import { getMonthLenght } from '$lib/utils/month-lenght';
	import type { Event } from '$lib/interfaces/event.interface';

	export let events: Event[] = [];
	const dispatch = createEventDispatcher();
	let date: Date = new Date();
	let header = '';
	let maxDays = 0;
	let days: any[] = [];

	onMount(() => {
		update();
	});

	$: events ? update() : null;

	function update() {
		header = `${months[date.getMonth()]} ${date.getFullYear()}`;
		maxDays = getMonthLenght(date.getMonth(), date.getFullYear());

		days = [];
		const firstOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1);
		const dayOfWeek = firstOfTheMonth.getDay();
		for (let i = 0; i < dayOfWeek - 1; i++) {
			days.push(null);
		}

		days = [...days, ...range(1, maxDays + 1)];
	}

	function nextMonth() {
		date.setMonth(date.getMonth() + 1);
		update();
	}

	function prevMonth() {
		date.setMonth(date.getMonth() - 1);
		update();
	}

	function eventsForDate(day: number) {
		const month = date.getMonth();
		const year = date.getFullYear();
		const filtered = [];

		for (const event of events) {
			const eventDate = new Date(event.start);
			const eventDay = eventDate.getDate();
			const eventMonth = eventDate.getMonth();
			const eventYear = eventDate.getFullYear();

			if (eventDay == day && eventMonth == month && eventYear == year) filtered.push(event);
		}

		return filtered.sort((a, b) => {
			const aTime = new Date(a.start).getTime();
			const bTime = new Date(b.start).getTime();
			return aTime - bTime;
		});
	}

	function selectDay(day: number) {
		dispatch('select', {
			year: date.getFullYear(),
			month: date.getMonth(),
			day,
		});
	}
</script>

<div class="variant-filled-surface p-4 xl:p-8 rounded-xl shadow-lg space-y-4">
	<div class="w-full flex gap-8 justify-between items-center">
		<button on:click={prevMonth}> <ArrowLeft size={24} /> </button>
		<div class="text-xl text-center xl:w-[330px]">{header}</div>
		<button on:click={nextMonth}> <ArrowRight size={24} /> </button>
	</div>
	<div class="w-full grid grid-cols-7 bg-surface-500 gap-2 text-lg">
		{#each ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as weekDay}
			<div class="p-4 text-center font-extrabold bg-surface-900 shadow-xl rounded-lg">
				{weekDay}
			</div>
		{/each}
		{#each days as day, index}
			<button
				class="pt-3 pb-4 flex flex-col justify-center items-center relative shadow-lg transition-all duration-200 ease-out rounded-lg
            {index % 7 == 6 ? 'text-rose-600 font-bold' : ''}
            {day != null
					? 'bg-surface-700 hover:bg-surface-800 shadow-md hover:-translate-y-1'
					: ''}"
				disabled={day == null}
				on:click={() => selectDay(day)}
			>
				<div>{day == null ? '' : day}</div>
				<div class="w-full px-2">
					<div
						class="w-full flex gap-2 justify-center overflow-hidden mt-1 h-[9px] text-primary-500"
					>
						{#each eventsForDate(day) as event}
							<div style="background-color: {event.color};" class="p-1 rounded-full" />
						{/each}
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
