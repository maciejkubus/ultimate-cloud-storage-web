<script lang="ts">
	import Star from 'carbon-icons-svelte/lib/Star.svelte';
	import Folder from 'carbon-icons-svelte/lib/Folder.svelte';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import type { MenuItem } from '$lib/interfaces/menu-item.interface';
	import { onMount } from 'svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import type { Album } from '$lib/interfaces/album.interface';
	import { AlbumsService } from '$lib/services/albums.service';

	let activeItem = '';
	let albums: Album[] = [];

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
			name: 'Notes',
			url: '/app/notes',
		},
		{
			name: 'Download',
			url: '/app/download',
		},
		{
			name: 'Settings',
			url: '/app/settings',
		},
	];

	onMount(async () => {
		pageMetadataStore.subscribe((store) => {
			activeItem = store.title;
		});

		const albumsService = AlbumsService.getInstance();
		albums = (await albumsService.getMyAlbums(1)).data;
	});
</script>

<div class="p-4 h-full card flex flex-col">
	<header class="card-header font-bold">Ultimate Cloud Storage</header>
	<section class="flex-1 overflow-y-scroll py-4">
		<div class="p-4 pl-2 text-sm text-primary-500 flex gap-1 font-bold">
			<span class="text-tertiary-500">
				<Star size={20} />
			</span>
			<span> Featured </span>
		</div>
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
		{#if albums.length >= 1}
			<div class="p-4 pl-2 text-sm text-primary-500 flex gap-1 font-bold">
				<span class="text-tertiary-500">
					<Folder size={20} />
				</span>
				<span> Recent albums </span>
			</div>
			<ul class="mb-4 space-y-2">
				{#each albums as album}
					<li
						class="w-full flex items-stretch justify-stretch px-8 py-2 rounded-full text-lg {activeItem ==
						'Album - ' + album.title
							? 'variant-filled-surface'
							: ''}"
					>
						<a
							on:click={() => {
								drawerStore.close();
								goto('/app/albums/' + album.id);
							}}
							href={'/app/albums/' + album.id}
							class="text-primary-500 w-full"
						>
							{album.title}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
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
