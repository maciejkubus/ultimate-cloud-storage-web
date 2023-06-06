<script lang="ts">
	import type { Album } from '$lib/interfaces/album.interface';
	import { AlbumsService } from '$lib/services/albums.service';
	import { onMount } from 'svelte';
	import Star from 'carbon-icons-svelte/lib/Star.svelte';
	import ImageCopy from 'carbon-icons-svelte/lib/ImageCopy.svelte';

	const albumsService = AlbumsService.getInstance();
	let albums: Album[] = [];

	onMount(async () => {
		albums = await albumsService.getMyAlbums();
	});
</script>

<div class="p-4 h-full card flex flex-col">
	<header class="card-header font-bold">Ultimate Cloud Storage</header>
	<section class="flex-1 overflow-y-scroll py-4">
		<div class="pl-4 pb-1 text-sm text-primary-500 flex gap-1"><Star size={20} /> Featured</div>
		<ul class="list list-nav mb-4">
			<li class="w-full flex items-stretch justify-stretch pr-4">
				<a href="/" class="text-primary-500 w-full">Home</a>
			</li>
			<li class="w-full flex items-stretch justify-stretch pr-4">
				<a href="/app/" class="text-primary-500 w-full">Files</a>
			</li>
			<li class="w-full flex items-stretch justify-stretch pr-4">
				<a href="/app/albums" class="text-primary-500 w-full">Albums</a>
			</li>
		</ul>
		<div class="pl-4 pb-1 text-sm text-primary-500 flex gap-1"><ImageCopy size={20} /> Albums</div>
		<ul class="list list-nav">
			{#each albums as album}
				<li class="w-full flex items-stretch justify-stretch pr-4">
					<a href="/app/albums/{album.id}" class="text-primary-500 w-full">{album.title}</a>
				</li>
			{/each}
		</ul>
	</section>
	<footer class="card-footer text-sm text-center">
		Ultimate Cloud Storage <br /> Copywrite &copy; 2023 <br />
		<a class="focus:outline-0" href="https://github.com/maciejkubus/"> Maciej Kubus </a>
	</footer>
</div>
