<script lang="ts">
	import type { Emotion } from '$lib/interfaces/emotion.interface';
	import { EmotionsService } from '$lib/services/emotions.service';
	import { colors } from '$lib/utils/calendar-colors';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import FormInput from '../form-input/form-input.svelte';
	import EmoticonPicker from '../emoticon-picker/emoticon-picker.svelte';

	const dispatch = createEventDispatcher();
	let loading = false;
	let emotionsService: EmotionsService | null = null;
	let emoticon = '';

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
		},
		validationSchema: yup.object().shape({
			name: yup.string().required('Name is required'),
		}),
		onSubmit: async (values) => {
			loading = true;

			const emotion: Emotion = {
				name: values.name,
				emoticon: emoticon,
			};

			try {
				const data = await emotionsService?.create(emotion);
				dispatch('created', data);
				toastStore.trigger({
					message: 'Emotion Created',
				});
			} catch (error) {
				toastStore.trigger({
					message: error + '',
					background: 'variant-filled-error',
				});
			}

			$form.name = '';
			loading = false;
		},
	});

	onMount(() => {
		emotionsService = EmotionsService.getInstance();
	});
</script>

<div class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-4">
	<h3 class="text-3xl">Add emotion!</h3>
	<form on:submit|preventDefault={handleSubmit} class="mt-2">
		<div class="flex gap-6">
			<FormInput>
				<span slot="label" class="pl-2">Emotion name </span>
				<input
					slot="input"
					class="input"
					type="text"
					placeholder="Emotion Name"
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
		</div>
		<div class="w-full flex justify-between items-end">
			<EmoticonPicker on:change={(e) => (emoticon = e.detail)} />
			<button
				class="btn variant-filled-secondary px-8 rounded-xl w-full lg:w-24"
				disabled={loading}
			>
				Add
			</button>
		</div>
	</form>
</div>
