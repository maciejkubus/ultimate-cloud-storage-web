<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});

	onMount(() => {
		if (browser) {
			if (user.loggedIn) {
				window.location.href = '/dashboard/';
			} else {
				window.location.href = '/auth/login';
			}
		}
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Super Ultimate Storage</h1>
		<!-- <div class="text-center">
			<h3 class="h3">Looks like empty space</h3>
			<p>Let's change that! Click the button below to create your first folder.</p> -->
		<!-- </div> -->
	</div>
</div>
