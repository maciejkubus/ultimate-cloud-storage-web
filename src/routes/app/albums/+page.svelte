<script lang="ts">
	import AlbumExplorer from '$lib/components/album-explorer/album-explorer.svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	let activeAlbum: number = 0;

	onMount(() => {
		pageMetadataStore.set({
			title: 'Albums',
		});
	});
</script>

{#if activeAlbum}
	<div>activeAlbum: {activeAlbum}</div>
{:else}
	<AlbumExplorer />
{/if}
