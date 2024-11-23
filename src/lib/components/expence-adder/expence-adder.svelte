<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import FormInput from '$lib/components/form-input/form-input.svelte';
	import * as yup from 'yup';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { ExpencesService } from '$lib/services/expences.service';
	import { createEventDispatcher } from 'svelte';

	let loading = false;
	const expenceService = ExpencesService.getInstance();
	const dispatch = createEventDispatcher();

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
			amount: '',
			description: '',
			// category: '',
			// tags: '',
		},
		validationSchema: yup.object().shape({
			name: yup
				.string()
				.required('Name is required')
				.min(3, 'Name must be at least 3 characters')
				.max(24, 'Name must be shorter than 24 chars'),
			amount: yup.string().required('Please enter value').min(0),
			description: yup
				.string()
				.min(0, 'Description must be at least 0 characters')
				.max(60, 'Description must be shorter than 60 chars'),
			// category: yup
			// 	.string()
			// 	.min(0, 'Category must be at least 0 characters')
			// 	.max(20, 'Category must be shorter than 60 chars'),
			// tags: yup
			// 	.string()
			// 	.min(0, 'Tags must be at least 0 characters')
			// 	.max(60, 'Tags must be shorter than 60 chars'),
		}),
		onSubmit: async (values) => {
			loading = true;
			try {
				const expence = await expenceService.create({
					name: $form.name,
					amount: parseFloat($form.amount),
					description: $form.description,
				});
				dispatch('new', expence);
				toastStore.trigger({
					message: 'Added ' + $form.name,
				});
			} catch (error) {
				toastStore.trigger({
					message: error + '',
					background: 'variant-filled-error',
				});
			}

			$form.name = '';
			$form.amount = '';
			$form.description = '';
			// $form.category = '';
			// $form.tags = '';

			loading = false;
		},
	});
</script>

<div class="w-full p-8 rounded-lg variant-filled-surface shadow-lg">
	<h3 class="text-4xl">Add transaction</h3>
	<form on:submit|preventDefault={handleSubmit} class="mt-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<FormInput>
				<span slot="label" class="pl-2"> Name </span>
				<input
					slot="input"
					class="input"
					type="text"
					placeholder="Name of transaction"
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
				<span slot="label" class="pl-2"> Amount </span>
				<input
					slot="input"
					class="input"
					type="number"
					placeholder="Value of transaction"
					on:change={handleChange}
					bind:value={$form.amount}
					disabled={loading}
				/>
				<span slot="error" class="px-2">
					{#if $errors.amount}
						{$errors.amount}
					{/if}
				</span>
			</FormInput>
		</div>
		<FormInput>
			<span slot="label" class="pl-2"> Description </span>
			<textarea
				slot="input"
				class="input h-24"
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
		<div class="w-full flex justify-end">
			<button class="btn variant-filled-secondary px-8" disabled={loading}> Add </button>
		</div>
	</form>
</div>
