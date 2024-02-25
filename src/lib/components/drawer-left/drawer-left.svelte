<script lang="ts">
	import Star from 'carbon-icons-svelte/lib/Star.svelte';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import type { MenuItem } from '$lib/interfaces/menu-item.interface';
	import { onMount } from 'svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';

	let activeItem = '';

	const menuItems: MenuItem[] = [
		{
			name: 'Home',
			url: '/app',
		},
		{
			name: 'All Files',
			url: '/app/all',
		},
		{
			name: 'Albums',
			url: '/app/albums',
		},
		{
			name: 'Settings',
			url: '/app/settings',
		},
	];

	onMount(() => {
		pageMetadataStore.subscribe((store) => {
			activeItem = store.title;
		});
	});
</script>

<div class="p-4 h-full card flex flex-col">
	<header class="card-header font-bold">Ultimate Cloud Storage</header>
	<section class="flex-1 overflow-y-scroll py-4">
		<ul class="mb-4 space-y-2">
			{#each menuItems as item}
				<li
					class="w-full flex items-stretch justify-stretch px-8 py-2 rounded-full text-lg {activeItem ==
					item.name
						? 'variant-filled-surface'
						: ''}"
				>
					<a
						on:click={() => {
							drawerStore.close();
							goto(item.url);
						}}
						href={item.url}
						class="text-primary-500 w-full"
					>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</section>
	<footer class="card-footer text-sm text-center">
		Ultimate Cloud Storage <br /> Copywrite &copy; 2023 <br />
		<a
			on:click={() => drawerStore.close()}
			class="focus:outline-0"
			href="https://github.com/maciejkubus/"
		>
			Maciej Kubus
		</a>
	</footer>
</div>
