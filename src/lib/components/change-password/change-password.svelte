<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import FormInput from '$lib/components/form-input/form-input.svelte';
	import * as yup from 'yup';
	import { UserService } from '$lib/services/user.service';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { toastStore } from '@skeletonlabs/skeleton';

	let loading = false;
	const userServices = UserService.getInstance();

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
		validationSchema: yup.object().shape({
			newPassword: yup
				.string()
				.required('Please enter your password')
				.min(8, 'Password must be at least 8 characters'),
			confirmPassword: yup
				.string()
				.required('Please confirm your password')
				.oneOf([yup.ref('newPassword')], 'Passwords must match'),
		}),
		onSubmit: async (values) => {
			try {
				await userServices.changePassword(user.user.id, values.currentPassword, values.newPassword);
				$form.currentPassword = '';
				$form.newPassword = '';
				$form.confirmPassword = '';
				toastStore.trigger({
					message: 'Your password has been changed successfully',
				});
			} catch (error) {
				console.log('weehoo' + error);
				toastStore.trigger({
					message: error + '',
					background: 'variant-filled-error',
				});
			}
		},
	});
</script>

<div class="card variant-glass-tertiary text-primary-500 p-8 w-full md:w-1/2">
	<h3 class="h3">Change your password</h3>
	<form on:submit|preventDefault={handleSubmit} class="mt-8">
		<FormInput>
			<span slot="label" class="pl-2"> New password </span>
			<input
				slot="input"
				class="input"
				type="password"
				placeholder="New password"
				on:change={handleChange}
				bind:value={$form.newPassword}
				disabled={loading}
			/>
			<span slot="error" class="px-2">
				{#if $errors.newPassword}
					{$errors.newPassword}
				{/if}
			</span>
		</FormInput>
		<FormInput>
			<span slot="label" class="pl-2"> Confirm password </span>
			<input
				slot="input"
				class="input"
				type="password"
				placeholder="Confirm password"
				on:change={handleChange}
				bind:value={$form.confirmPassword}
				disabled={loading}
			/>
			<span slot="error" class="px-2">
				{#if $errors.confirmPassword}
					{$errors.confirmPassword}
				{/if}
			</span>
		</FormInput>
		<FormInput class="mt-4">
			<span slot="label" class="pl-2"> Current password </span>
			<input
				slot="input"
				class="input"
				type="password"
				placeholder="Current password"
				on:change={handleChange}
				bind:value={$form.currentPassword}
				disabled={loading}
			/>
			<span slot="error" class="px-2">
				{#if $errors.currentPassword}
					{$errors.currentPassword}
				{/if}
			</span>
		</FormInput>
		<div class="w-full flex justify-end">
			<button class="btn variant-filled-secondary px-8" disabled={loading}> Submit </button>
		</div>
	</form>
</div>
