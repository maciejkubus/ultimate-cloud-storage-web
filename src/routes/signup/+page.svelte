<script lang="ts">
	import FormInput from '$lib/components/form-input/form-input.svelte';
	import FormCheckbox from '$lib/components/form-input/form-checkbox.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { createForm } from 'svelte-forms-lib';
	import type { RegisterData } from '$lib/interfaces/register-data.interface';
	import * as yup from 'yup';
	import { AuthenticationService } from '$lib/services/authentication.service';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});

	export let isFocused = false;
	let loading = false;
	const authenticationService = AuthenticationService.getInstance();

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			privacyPolicy: false,
		},
		validationSchema: yup.object().shape({
			username: yup.string().required('Please enter your username'),
			email: yup
				.string()
				.email('Please enter a valid email address')
				.required('Please enter your email'),
			password: yup
				.string()
				.required('Please enter your password')
				.min(8, 'Password must be at least 8 characters'),
			confirmPassword: yup
				.string()
				.required('Please confirm your password')
				.oneOf([yup.ref('password')], 'Passwords must match'),
			privacyPolicy: yup.boolean().oneOf([true], 'Please accept the privacy policy'),
		}),
		onSubmit: async (values: RegisterData) => {
			loading = true;
			try {
				await authenticationService.register(values);
				toastStore.trigger({
					message: 'Account created successfully',
				});
				window.location.href = '/login?created=1';
			} catch (e) {
				toastStore.trigger({
					message: e + '',
					timeout: 5000,
					background: 'variant-filled-error',
				});
			}
			loading = false;
		},
	});

	onMount(() => {
		if (browser && user.loggedIn) {
			window.location.href = '/';
		}
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Sign up</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-4 p-4 w-full max-w-md">
		<section>
			<form use:focusTrap={isFocused} on:submit|preventDefault={handleSubmit} class="space-y-4">
				<h2 class="text-center font-bold text-4xl">Sign up</h2>
				<div class="space-y-1">
					<FormInput>
						<span slot="label"> Username </span>
						<input
							slot="input"
							class="input"
							type="text"
							placeholder="Username"
							on:change={handleChange}
							bind:value={$form.username}
							aria-autocomplete="none"
						/>
						<span slot="error">
							{#if $errors.username}
								{$errors.username}
							{/if}
						</span>
					</FormInput>
					<FormInput>
						<span slot="label"> E-mail </span>
						<input
							slot="input"
							class="input"
							type="email"
							placeholder="E-mail"
							on:change={handleChange}
							bind:value={$form.email}
						/>
						<span slot="error">
							{#if $errors.email}
								{$errors.email}
							{/if}
						</span>
					</FormInput>
					<FormInput>
						<span slot="label"> Password </span>
						<input
							slot="input"
							class="input"
							type="password"
							placeholder="Password"
							on:change={handleChange}
							bind:value={$form.password}
						/>
						<span slot="error">
							{#if $errors.password}
								{$errors.password}
							{/if}
						</span>
					</FormInput>
					<FormInput>
						<span slot="label"> Confirm Password </span>
						<input
							slot="input"
							class="input"
							type="password"
							placeholder="Password"
							on:change={handleChange}
							bind:value={$form.confirmPassword}
						/>
						<span slot="error">
							{#if $errors.confirmPassword}
								{$errors.confirmPassword}
							{/if}
						</span>
					</FormInput>
					<FormCheckbox>
						<span slot="label">
							I agree to the <a href="/privacy-policy"> Privacy Policy </a>
						</span>
						<input
							slot="input"
							class="checkbox focus:border-0 focus:ring-0 focus:ring-offset-0 focus:ring-opacity-0 focus:outline-none -mt-1"
							type="checkbox"
							bind:checked={$form.privacyPolicy}
						/>
						<span slot="error">
							{#if $errors.privacyPolicy}
								{$errors.privacyPolicy}
							{/if}
						</span>
					</FormCheckbox>
				</div>
				<button class="btn variant-filled-secondary w-full" disabled={loading}> Submit </button>
				<div>
					<p class="text-center">
						Already have an account? <a href="/login">Log in</a>
					</p>
				</div>
			</form>
		</section>
	</div>
</div>
