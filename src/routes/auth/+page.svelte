<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(() => {
		if (browser) {
			window.location.href = '/auth/login';
		}
	});
</script>
