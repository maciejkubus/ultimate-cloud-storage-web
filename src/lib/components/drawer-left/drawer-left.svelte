<script lang="ts">
	import Star from 'carbon-icons-svelte/lib/Star.svelte';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
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
		<ul class="list list-nav mb-4">
			<li class="w-full flex items-stretch justify-stretch pr-4">
				<a
					on:click={() => {
						drawerStore.close();
						goto('/app');
					}}
					href="/app"
					class="text-primary-500 w-full"
				>
					Home
				</a>
			</li>
			<li class="w-full flex items-stretch justify-stretch pr-4">
				<a
					on:click={() => {
						drawerStore.close();
						goto('/app');
					}}
					href="/app"
					class="text-primary-500 w-full"
				>
					Files
				</a>
			</li>
			<li class="w-full flex items-stretch justify-stretch pr-4">
				<a
					on:click={() => {
						drawerStore.close();
						goto('/app/albums');
					}}
					href="/app/albums"
					class="text-primary-500 w-full"
				>
					Albums
				</a>
			</li>
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
