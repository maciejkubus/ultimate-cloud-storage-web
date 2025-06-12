<script lang="ts">
	import { EmotionCheckService } from '$lib/services/emotion-check.service';
	import { range } from '$lib/utils/range';
	import { type PopupSettings, popup, Autocomplete, toastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';
	import EmotionSelect from '../emotion-select/emotion-select.svelte';
	import { isValidDate } from '$lib/utils/is-valid-date';
	import type { EmotionCheck } from '$lib/interfaces/emotion-check.interface';

	const dispatch = createEventDispatcher();
	let loading = false;
	let emotionCheckService: EmotionCheckService | null = null;

	let date = new Date();

	let day = '' + date.getDate();
	let month = '' + (date.getMonth() + 1);
	let year = '' + date.getFullYear();
	let hour = '' + date.getHours();
	let minute = '' + date.getMinutes();
	let selectedEmotionsId: number[] = [];
	let error = '';

	let popupSettingsDay: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteDay',
		placement: 'bottom',
	};

	let popupSettingsMonth: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteMonth',
		placement: 'bottom',
	};

	let popupSettingsYear: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteYear',
		placement: 'bottom',
	};

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
		emotionCheckService = EmotionCheckService.getInstance();
	});

	const validate = async () => {
		loading = true;

		const emotionCheck: EmotionCheck = {
			day: parseInt(day),
			month: parseInt(month),
			year: parseInt(year),
			hour: parseInt(hour),
			minute: parseInt(minute),
			emotions: [],
		};

		if (
			!isValidDate(
				emotionCheck.day,
				emotionCheck.month,
				emotionCheck.year,
				emotionCheck.hour,
				emotionCheck.minute,
			)
		) {
			error = 'Date is incorrect.';
			loading = false;
			return;
		}

		const newItem = await emotionCheckService?.create(emotionCheck);

		for (const id of selectedEmotionsId) {
			if (!newItem?.id) continue;
			await emotionCheckService?.addEmotion(+newItem?.id, id);
		}

		toastStore.trigger({
			message: 'Great job!',
		});

		dispatch('created', newItem);
		error = '';
		loading = false;
	};
</script>

<div class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-4">
	<h3 class="text-3xl">How was your day?</h3>
	<div class="text-error-500">{error}</div>
	<div class="flex gap-4 justify-stretch items-center flex-wrap">
		<div class="flex gap-4 justify-between items-center mr-8">
			<!-- Day -->
			<div class="w-16 lg:w-24">
				<label for="day" class="pl-2 pb-1">Day</label>
				<input
					class="input autocomplete text-lg"
					type="search"
					name="day"
					bind:value={day}
					placeholder="00"
					use:popup={popupSettingsDay}
				/>
				<div
					data-popup="popupAutocompleteDay"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto z-[999]"
					tabindex="-1"
				>
					<Autocomplete
						bind={day}
						on:selection={(e) => (day = e.detail.label)}
						options={range(1, 32).map((e) => ({
							label: (e < 10 ? '0' : '') + e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>

			<!-- Month -->
			<div class="w-16 lg:w-24">
				<label for="month" class="pl-2 pb-1">Month</label>
				<input
					class="input autocomplete text-lg"
					type="search"
					name="month"
					bind:value={month}
					placeholder="00"
					use:popup={popupSettingsMonth}
				/>
				<div
					data-popup="popupAutocompleteMonth"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto z-[999]"
					tabindex="-1"
				>
					<Autocomplete
						bind={month}
						on:selection={(e) => (month = e.detail.label)}
						options={range(1, 13).map((e) => ({
							label: (e < 10 ? '0' : '') + e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>

			<!-- Year -->
			<div class="w-16 lg:w-24">
				<label for="year" class="pl-2 pb-1">Year</label>
				<input
					class="input autocomplete text-lg"
					type="search"
					name="year"
					bind:value={year}
					placeholder="2025"
					use:popup={popupSettingsYear}
				/>
				<div
					data-popup="popupAutocompleteYear"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto z-[999]"
					tabindex="-1"
				>
					<Autocomplete
						bind={year}
						on:selection={(e) => (year = e.detail.label)}
						options={range(2020, 2041).map((e) => ({
							label: e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>
		</div>
		<div class="flex gap-4 justify-between items-center">
			<!-- Hour -->
			<div class="w-16 lg:w-24">
				<label for="hour" class="pl-2 pb-1">Hour</label>
				<input
					class="input autocomplete text-lg"
					type="search"
					name="hour"
					bind:value={hour}
					placeholder="00"
					use:popup={popupSettingsHour}
				/>
				<div
					data-popup="popupAutocompleteHour"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto z-[999]"
					tabindex="-1"
				>
					<Autocomplete
						bind={hour}
						on:selection={(e) => (hour = e.detail.label)}
						options={range(0, 24).map((e) => ({
							label: (e < 10 ? '0' : '') + e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>
			<!-- Minute -->
			<div class="w-16 lg:w-24">
				<label for="minute" class="pl-2 pb-1">Minute</label>
				<input
					class="input autocomplete text-lg"
					type="search"
					name="minute"
					bind:value={minute}
					placeholder="00"
					use:popup={popupSettingsMinute}
				/>
				<div
					data-popup="popupAutocompleteMinute"
					class="card w-full max-w-[120px] max-h-48 p-4 overflow-y-auto z-[999]"
					tabindex="-1"
				>
					<Autocomplete
						bind={minute}
						on:selection={(e) => (minute = e.detail.label)}
						options={range(0, 60).map((e) => ({
							label: (e < 10 ? '0' : '') + e.toString(),
							value: e.toString(),
						}))}
						regionItem="text-center mt-2"
					/>
				</div>
			</div>
		</div>
		<div class="w-full p-2 flex flex-row flex-wrap gap-4">
			<EmotionSelect on:change={(e) => (selectedEmotionsId = e.detail)} />
		</div>
		<div class="w-full flex justify-end items-end">
			<button
				class="btn variant-filled-secondary px-8 rounded-xl w-full lg:w-24 disabled:bg-secondary-800"
				disabled={loading}
				on:click={validate}
			>
				Add
			</button>
		</div>
	</div>
</div>
