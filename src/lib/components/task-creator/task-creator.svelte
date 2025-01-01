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

	const dispatch = createEventDispatcher();
	const colors = ['#EE6533', '#3d51c9', '#159F46', '#F2087C', '#8E39AB', '#c50e4a'];
	let eventsService: EventsService | null = null;
	let collapsed = true;
	let loading = false;
	let date = new Date();
	let color = '#3d51c9';

	onMount(() => {
		eventsService = EventsService.getInstance();
	});

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
		},
		validationSchema: yup.object().shape({
			name: yup.string().required('Name is required'),
		}),
		onSubmit: async (values) => {
			loading = true;

			const task: Event = {
				name: values.name,
				start: date.toISOString(),
				color: color,
				type: 'task',
			};
			try {
				await eventsService?.create(task);
				dispatch('created', task);
				toastStore.trigger({
					message: 'Task created',
				});
			} catch (error) {
				toastStore.trigger({
					message: error + '',
					background: 'variant-filled-error',
				});
			}

			date = new Date();
			$form.name = '';
			loading = false;
		},
	});
</script>

<div
	class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-8 overflow-hidden transition-all ease-in-out duration-200
{collapsed ? 'h-[76px]' : 'h-[460px] xl:h-[360px]'}"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="h-[45px] flex justify-between items-center cursor-pointer"
		on:click={() => (collapsed = !collapsed)}
	>
		<h3 class="text-3xl">Add task</h3>
		<button class="pr-2 pt-1">
			<ChevronDown
				size={32}
				class="transition-all ease-in-out duration-200 {!collapsed ? 'rotate-180' : ''}"
			/>
		</button>
	</div>
	<form on:submit|preventDefault={handleSubmit} class="mt-1 h-[300px] xl:h-[238px;]">
		<FormInput>
			<span slot="label" class="pl-2"> Task Name </span>
			<input
				slot="input"
				class="input"
				type="text"
				placeholder="Task name"
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
		<div class="mt-4 mb-8">
			<ColorPicker value={color} {colors} on:change={(event) => (color = event.detail)} />
		</div>
		<div class="w-full flex flex-col xl:flex-row justify-between gap-4">
			<DatePicker on:change={(event) => (date = event.detail)} style="background-color: {color};" />
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
