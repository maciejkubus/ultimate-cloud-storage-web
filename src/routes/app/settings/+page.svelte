<script lang="ts">
	import ChangePassword from '$lib/components/change-password/change-password.svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	onMount(() => {
		pageMetadataStore.set({
			title: 'Settings',
		});
	});
</script>

<div class="w-full flex justify-center items-center flex-col md:flex-row">
	<ChangePassword />
</div>
