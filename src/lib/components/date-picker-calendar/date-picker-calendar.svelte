<script lang="ts">
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import {
		Autocomplete,
		modalStore,
		popup,
		toastStore,
		type ModalSettings,
		type PopupSettings,
	} from '@skeletonlabs/skeleton';
	import { months } from '$lib/utils/months';
	import { onMount } from 'svelte';
	import { range } from '$lib/utils/range';
	import { getMonthLenght } from '$lib/utils/month-lenght';

	export let date: Date;

	let header = '';
	let maxDays = 0;
	let days: any[] = [];
	let hour = '';
	let minute = '';

	let popupSettingsHour: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteHour',
		placement: 'bottom',
	};

	let popupSettingsMinute: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteMinute',
		placement: 'bottom',
	};

	onMount(() => {
		update();
	});

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

		hour = date.getHours().toString();
		minute = date.getMinutes().toString();

		if (hour.length == 1) hour = '0' + hour;
		if (minute.length == 1) minute = '0' + minute;
	}

	function nextMonth() {
		date.setMonth(date.getMonth() + 1);
		update();
	}

	function prevMonth() {
		date.setMonth(date.getMonth() - 1);
		update();
	}

	function setDate(day: number) {
		date.setDate(day);
		update();
	}

	function submit() {
		if ($modalStore[0].response) $modalStore[0].response(date.toISOString());
		modalStore.close();
	}

	function onHourSelection(event: CustomEvent<any>): void {
		hour = event.detail.label;
		date.setHours(parseInt(hour));
	}

	function onMinuteSelection(event: CustomEvent<any>): void {
		minute = event.detail.label;
		date.setMinutes(parseInt(minute));
	}
</script>

<div class="variant-filled-surface p-4 xl:p-8 rounded-xl shadow-lg space-y-4">
	<div class="w-full flex gap-8 justify-between items-center">
		<button on:click={prevMonth}> <ArrowLeft size={24} /> </button>
		<div class="text-xl text-center xl:w-[330px]">{header}</div>
		<button on:click={nextMonth}> <ArrowRight size={24} /> </button>
	</div>
	<div class="w-full grid grid-cols-7">
		{#each ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as day}
			<div class="p-4 text-center font-extrabold">
				{day}
			</div>
		{/each}
		{#each days as day, index}
			<button
				class="p-4 text-center aspect-square rounded-full transition-all duration-150 ease-in-out
          {index % 7 == 6 ? 'text-rose-600 font-bold' : ''}
          {day != null ? 'hover:bg-surface-800' : ''}
          {day == date.getDate() ? 'bg-surface-800' : ''}"
				disabled={day == null}
				on:click={() => setDate(day)}
			>
				{day == null ? '' : day}
			</button>
		{/each}
	</div>

	<div class="pt-4 w-full flex flex-col xl:flex-row justify-between items-end gap-8">
		<div class="flex gap-8">
			<div class="w-full xl:w-[120px]">
				<label for="hour" class="pl-2 pb-1">Hour</label>
				<input
					class="input autocomplete"
					type="search"
					name="hour"
					bind:value={hour}
					placeholder="00"
					use:popup={popupSettingsHour}
				/>
				<div
					data-popup="popupAutocompleteHour"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto"
					tabindex="-1"
				>
					<Autocomplete
						bind={hour}
						on:selection={onHourSelection}
						options={range(0, 24).map((e) => ({
							label: (e < 10 ? '0' : '') + e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>
			<div class="w-full xl:w-[120px]">
				<label for="minute" class="pl-2 pb-1">Minute</label>
				<input
					class="input autocomplete"
					type="search"
					name="minute"
					bind:value={minute}
					placeholder="00"
					use:popup={popupSettingsMinute}
				/>
				<div
					data-popup="popupAutocompleteMinute"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto"
					tabindex="-1"
				>
					<Autocomplete
						bind={minute}
						on:selection={onMinuteSelection}
						options={range(0, 60).map((e) => ({
							label: (e < 10 ? '0' : '') + e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>
		</div>
		<button
			class="btn btn-sm px-8 py-2 variant-filled-secondary rounded-xl w-full xl:w-min h-12"
			on:click={submit}
		>
			Submit
		</button>
	</div>

	<!-- <div class="w-full pt-2 flex flex-col xl:flex-row justify-end gap-4">
		<button class="btn variant-filled-secondary px-8 rounded-xl w-full" on:click={submit}>
			Submit
		</button>
	</div> -->
</div>
