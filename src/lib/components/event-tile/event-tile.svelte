<script lang="ts">
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import FormInput from '../form-input/form-input.svelte';
	import DatePicker from '../date-picker/date-picker.svelte';
	import ColorPicker from '../color-picker/color-picker.svelte';
	import { EventsService } from '$lib/services/events.service';
	import { onMount } from 'svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import { colors } from '$lib/utils/calendar-colors';
	import FormCheckbox from '../form-input/form-checkbox.svelte';

	let editable = false;
	export let event: Event;
	const dispatch = createEventDispatcher();
	let eventsService: EventsService | null = null;
	let loading = false;
	let date = new Date();
	let endDate = new Date();
	let color = '#3d51c9';

	onMount(() => {
		eventsService = EventsService.getInstance();
		date = new Date(event.start);
		color = event.color;
		$form.name = event.name;
		$form.description = event.description ? event.description : '';
		if (event.end) endDate = new Date(event.end);
	});

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
			description: '',
		},
		validationSchema: yup.object().shape({
			name: yup.string().required('Name is required'),
			description: yup.string(),
		}),
		onSubmit: async (values) => {
			loading = true;

			const task: Event = {
				name: values.name,
				start: date.toISOString(),
				end: endDate.toISOString(),
				color: color,
				type: 'event',
			};
			try {
				if (!event.id) throw 'No ID specified.';
				await eventsService?.update(event.id, task);
				dispatch('created', task);
				toastStore.trigger({
					message: 'Event updated',
				});
			} catch (error) {
				toastStore.trigger({
					message: error + '',
					background: 'variant-filled-error',
				});
			}

			color = colors[0];
			$form.name = '';
			$form.description = '';
			editable = false;
			loading = false;
		},
	});
</script>

<div
	class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-8 overflow-hidden transition-all ease-in-out duration-200"
>
	<form on:submit|preventDefault={handleSubmit} class="mt-1">
		<div class="flex gap-4 flex-col xl:flex-row">
			<FormInput>
				<span slot="label" class="pl-2"> Title </span>
				<input
					slot="input"
					class="input"
					type="text"
					placeholder="Title"
					on:change={handleChange}
					bind:value={$form.name}
					disabled={loading}
				/>
				<span slot="error" class="px-2">
					{#if $errors.name}
						{$errors.name}
					{/if}
				</span>
			</FormInput>
			<FormInput>
				<span slot="label" class="pl-2"> Description </span>
				<input
					slot="input"
					class="input"
					type="text"
					placeholder="Description"
					on:change={handleChange}
					bind:value={$form.description}
					disabled={loading}
				/>
				<span slot="error" class="px-2">
					{#if $errors.description}
						{$errors.description}
					{/if}
				</span>
			</FormInput>
		</div>
		<div class="mt-4 mb-8 flex flex-col xl:flex-row gap-4">
			<div class="flex flex-col w-full">
				<div class="mb-2">Start date:</div>
				<DatePicker
					{date}
					on:change={(event) => (date = event.detail)}
					style="background-color: {color};"
				/>
			</div>
			<div class="flex flex-col w-full">
				<div class="mb-2">Finish date:</div>
				<DatePicker
					date={endDate}
					on:change={(event) => (endDate = event.detail)}
					style="background-color: {color};"
				/>
			</div>
		</div>
		<div class="w-full flex flex-col xl:flex-row justify-between gap-4">
			<ColorPicker value={color} {colors} on:change={(event) => (color = event.detail)} />
			<button
				class="btn variant-filled-secondary px-8 rounded-xl"
				style="background-color: {color};"
				disabled={loading}
			>
				Edit
			</button>
		</div>
	</form>
</div>
