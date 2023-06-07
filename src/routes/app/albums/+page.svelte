<script lang="ts">
	import AlbumExplorer from '$lib/components/album-explorer/album-explorer.svelte';

	let activeAlbum: number = 0;
</script>

<div class="w-full max-w-6xl">
	{#if activeAlbum}
		<div>activeAlbum: {activeAlbum}</div>
	{:else}
		<AlbumExplorer {activeAlbum} />
	{/if}
</div>
