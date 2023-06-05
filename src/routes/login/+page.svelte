<script lang="ts">
	import FormInput from '$lib/components/form-input/form-input.svelte';
	import FormCheckbox from '$lib/components/form-input/form-checkbox.svelte';
	import { LoginForm } from '$lib/forms/login.form';
	import { focusTrap } from '@skeletonlabs/skeleton';

	export let isFocused = false;

	const loginForm = new LoginForm();
	const { form, errors, handleChange, handleSubmit } = loginForm.createForm();
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-4 p-4 w-full max-w-md">
		<section>
			<form use:focusTrap={isFocused} class="space-y-8">
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
								disabled={loginForm.loading || loginForm.sent}
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
								disabled={loginForm.loading || loginForm.sent}
							/>
							<span slot="error">
								{#if $errors.password}
									{$errors.password}
								{/if}
							</span>
						</FormInput>
					</div>
					<button class="btn variant-filled-secondary w-full">Submit</button>
					<div>
						<p class="text-center">
							Don't have an account? <a href="/signup">Sign up</a>
						</p>
					</div>
				</div>
			</form>
		</section>
	</div>
</div>
