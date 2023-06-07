<script lang="ts">
	import FormInput from '$lib/components/form-input/form-input.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import type { LoginData } from '$lib/interfaces/login-data.interface';
	import { AuthenticationService } from '$lib/services/authentication.service';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

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
			password: '',
		},
		validationSchema: yup.object().shape({
			username: yup.string().required('Please enter your username'),
			password: yup.string().required('Please enter your password'),
		}),
		onSubmit: async (values: LoginData) => {
			loading = true;
			try {
				const res = await authenticationService.login(values);
				userStore.set({
					loggedIn: true,
					access_token: res.access_token,
					user: res.user,
				});
				toastStore.trigger({
					message: 'Logged in successfully',
				});
				window.location.href = '/';
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
		const urlParams = new URLSearchParams(window.location.search);
		const created = urlParams.get('created');
		if (created) {
			toastStore.trigger({
				message: 'You have successfully created your account. Please log in.',
			});
		}
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Log in</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-4 p-4 w-full max-w-md">
		<section>
			<form use:focusTrap={isFocused} on:submit|preventDefault={handleSubmit} class="space-y-4">
				<h2 class="text-center font-bold text-4xl">Log in</h2>
				<div class="space-y-4">
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
							<span slot="label"> Password </span>
							<input
								slot="input"
								class="input"
								type="password"
								placeholder="Password"
								on:change={handleChange}
								bind:value={$form.password}
								disabled={loading}
							/>
							<span slot="error">
								{#if $errors.password}
									{$errors.password}
								{/if}
							</span>
						</FormInput>
					</div>
					<button class="btn variant-filled-secondary w-full" disabled={loading}> Submit </button>
					<div>
						<p class="text-center">
							Don't have an account? <a
								href="/auth/signup"
								on:click|preventDefault={() => goto('/auth/signup')}>Sign up</a
							>
						</p>
					</div>
				</div>
			</form>
		</section>
	</div>
</div>
