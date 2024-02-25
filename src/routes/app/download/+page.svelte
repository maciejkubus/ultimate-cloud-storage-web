<script lang="ts">
	import ChangePassword from '$lib/components/change-password/change-password.svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	onMount(() => {
		pageMetadataStore.set({
			title: 'Download',
		});
	});
</script>

<div class="w-full flex justify-center md:justify-start items-start flex-col md:flex-row gap-8">
	<div class="card variant-glass-tertiary text-primary-500 p-8 w-full">
		<h3 class="h3 mb-4">Windows app</h3>
		<a href="/storage-win.zip" target="_blank">
			<button class="btn variant-filled-secondary px-8"> Download </button>
		</a>
	</div>
</div>
