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
		if (browser && user.loggedIn) {
			window.location.href = '/app/';
		}
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<div class="flex justify-between py-4 px-8">
			<div
				class="text-center flex-1 flex justify-center items-center text-xl font-bold tracking-wider"
			>
				ULTIMATE <img src="/favicon.png" alt="logo" class="h-16 inline" /> STORAGE
			</div>
		</div>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">
		<div class="w-full py-4 text-sm flex flex-col md:flex-row gap-2 items-center justify-center">
			<div>Ultimate Cloud Storage &copy; Copywrite 2023</div>
			<div><a href="https://github.com/maciejkubus/">Maciej Kubus</a></div>
		</div>
	</svelte:fragment>
</AppShell>
