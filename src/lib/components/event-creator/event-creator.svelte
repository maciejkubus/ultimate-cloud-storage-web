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

	export let createEvent = false;

	const dispatch = createEventDispatcher();
	let eventsService: EventsService | null = null;
	let collapsed = true;
	let loading = false;
	let date = new Date();
	let endDate = new Date();
	let color = '#3d51c9';

	onMount(() => {
		eventsService = EventsService.getInstance();
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
				color: color,
				type: createEvent ? 'event' : 'task',
			};
			if (createEvent) {
				task.end = endDate.toISOString();
			}
			try {
				await eventsService?.create(task);
				dispatch('created', task);
				toastStore.trigger({
					message: createEvent ? 'Event created' : 'Task created',
				});
			} catch (error) {
				toastStore.trigger({
					message: error + '',
					background: 'variant-filled-error',
				});
			}

			date = new Date();
			endDate = new Date();
			color = colors[0];
			$form.name = '';
			loading = false;
		},
	});
</script>

<div
	class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-8 overflow-hidden transition-all ease-in-out duration-200
{collapsed ? 'h-[76px]' : createEvent ? 'h-[720px] xl:h-[420px]' : 'h-[500px] xl:h-[420px]'}"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="h-[45px] flex justify-between items-center cursor-pointer"
		on:click={() => (collapsed = !collapsed)}
	>
		<h3 class="text-3xl"><slot /></h3>
		<button class="pr-2 pt-1">
			<ChevronDown
				size={32}
				class="transition-all ease-in-out duration-200 {!collapsed ? 'rotate-180' : ''}"
			/>
		</button>
	</div>
	<form
		on:submit|preventDefault={handleSubmit}
		class="mt-1 {createEvent ? 'h-[720px] xl:h-[420px]' : 'h-[450px] xl:h-[420px]'}"
	>
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
			{#if createEvent}
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
			{/if}
		</div>
		<div class="mt-4 mb-8 flex flex-col xl:flex-row gap-4">
			<div class="flex flex-col w-full">
				<div class="mb-2">Start date:</div>
				<DatePicker
					on:change={(event) => (date = event.detail)}
					style="background-color: {color};"
				/>
			</div>
			{#if createEvent}
				<div class="flex flex-col w-full">
					<div class="mb-2">Finish date:</div>
					<DatePicker
						on:change={(event) => (endDate = event.detail)}
						style="background-color: {color};"
					/>
				</div>
			{/if}
		</div>
		<div class="w-full flex flex-col xl:flex-row justify-between gap-4">
			<ColorPicker value={color} {colors} on:change={(event) => (color = event.detail)} />
			<button
				class="btn variant-filled-secondary px-8 rounded-xl"
				style="background-color: {color};"
				disabled={loading}
			>
				Add
			</button>
		</div>
	</form>
</div>
