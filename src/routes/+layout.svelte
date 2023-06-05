<script lang="ts">
	import { AppShell, Toast } from '@skeletonlabs/skeleton';
	import '../style/theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../style/app.postcss';
	import { userStore } from '$lib/stores/user.store';
	import type { UserStore } from '$lib/interfaces/user-store.interface';

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});
</script>

<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<div class="flex justify-between py-4 px-8">
			<!-- <div>a</div> -->
			<div
				class="text-center flex-1 flex justify-center items-center text-xl font-bold tracking-wider"
			>
				ULTIMATE <img src="favicon.png" alt="logo" class="h-16 inline" /> STORAGE
			</div>
			{#if user.loggedIn}
				<!-- <div> -->
				<!-- <a href="/logout">Logout</a> -->
				<!-- </div> -->
			{/if}
		</div>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">
		<div class="w-full py-4 text-sm flex flex-col md:flex-row gap-2 items-center justify-center">
			<div>Super Ultimate Storage &copy; Copywrite 2023</div>
			<div><a href="https://github.com/maciejkubus/">Maciej Kubus</a></div>
		</div>
	</svelte:fragment>
</AppShell>
