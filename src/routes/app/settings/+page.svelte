<script lang="ts">
	import ChangePassword from '$lib/components/change-password/change-password.svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';
	import type { UserStore } from '$lib/interfaces/user-store.interface';
	import { userStore } from '$lib/stores/user.store';

	let user: UserStore;

	userStore.subscribe((value) => {
		user = value;
	});

	onMount(() => {
		pageMetadataStore.set({
			title: 'Settings',
		});
	});

	const formatDate = (dateRaw: string) => {
		const date = new Date(dateRaw);
		return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	};
</script>

<div class="w-full flex justify-center md:justify-start items-start flex-col md:flex-row gap-8">
	<div class="card variant-glass-tertiary text-primary-500 p-8 w-full md:max-w-xs">
		<h3 class="h3 mb-4">Your account</h3>
		<div><span class="font-bold"> Username: </span> {user.user.username}</div>
		<div><span class="font-bold"> E-mail: </span> {user.user.email}</div>
		<div>
			<span class="font-bold"> Created: </span>
			{formatDate(user.user.created)}
		</div>
	</div>
	<ChangePassword />
</div>
