<script lang="ts">
	import FormInput from '$lib/components/form-input/form-input.svelte';
	import FormCheckbox from '$lib/components/form-input/form-checkbox.svelte';
	import { RegisterForm } from '$lib/forms/register.form';
	import { focusTrap } from '@skeletonlabs/skeleton';

	export let isFocused = false;

	const registerForm = new RegisterForm();
	const { form, errors, handleChange, handleSubmit } = registerForm.createForm();
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-4 p-4 w-full max-w-md">
		<section>
			<form
				use:focusTrap={isFocused}
				on:submit|preventDefault={handleSubmit}
				class="space-y-4"
				autocomplete="off"
			>
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
							disabled={registerForm.loading || registerForm.sent}
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
							disabled={registerForm.loading || registerForm.sent}
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
							disabled={registerForm.loading || registerForm.sent}
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
							disabled={registerForm.loading || registerForm.sent}
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
							class="checkbox focus:border-0 focus:ring-0 focus:ring-offset-0 focus:ring-opacity-0 focus:outline-none mt-2 -mt-1"
							type="checkbox"
							on:change={handleChange}
							bind:value={$form.privacyPolicy}
							disabled={registerForm.loading || registerForm.sent}
						/>
						<span slot="error">
							{#if $errors.privacyPolicy}
								{$errors.privacyPolicy}
							{/if}
						</span>
					</FormCheckbox>
				</div>
				<button class="btn variant-filled-secondary w-full" disabled={registerForm.loading}>
					Submit
				</button>
				<div>
					<p class="text-center">
						Already have an account? <a href="/login">Log in</a>
					</p>
				</div>
			</form>
		</section>
	</div>
</div>
