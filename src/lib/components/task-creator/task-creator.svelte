<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import FormInput from '../form-input/form-input.svelte';

	let loading = false;
	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
			description: '',
		},
		validationSchema: yup.object().shape({
			name: yup.string().required('Name is required'),
			description: yup.string(),
		}),
		onSubmit: (values) => {},
	});
</script>

<div class="w-full bg-surface-700 rounded-lg p-4 shadow-lg flex flex-col gap-8">
	<h3 class="text-4xl">Add task</h3>
	<form on:submit|preventDefault={handleSubmit} class="mt-1">
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
				{#if $errors.name}
					{$errors.name}
				{/if}
			</span>
		</FormInput>
	</form>
</div>
