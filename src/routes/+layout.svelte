<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
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

<AppShell>
	<svelte:fragment slot="header">
		{#if user.loggedIn}
			Header
		{/if}
	</svelte:fragment>
	<!-- <svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment> -->
	<slot />
	<svelte:fragment slot="pageFooter">
		{#if user.loggedIn}
			Footer
		{/if}
	</svelte:fragment>
</AppShell>
