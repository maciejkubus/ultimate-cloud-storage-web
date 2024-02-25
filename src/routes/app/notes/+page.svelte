<script lang="ts">
	import { page } from '$app/stores';
	import NoteEditor from '$lib/components/note-editor/note-editor.svelte';
	import type { Note } from '$lib/interfaces/note.interface';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { NotesService } from '$lib/services/notes.service';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';
	import NoteTile from '$lib/components/note-tile/note-tile.svelte';
	import { goto } from '$app/navigation';

	let notesService: NotesService;
	let loading = true;

	let notes: Note[] = [];
	let paginationData: Paginated = {
		page: 1,
		totalPages: 1,
		lastPage: 1,
	};

	const loadNotes = async (page: number) => {
		loading = true;
		notes = [];
		const res = await notesService.getNotes(page);
		notes = res.data;
		paginationData.page = res.meta.currentPage;
		paginationData.totalPages = res.meta.totalPages;
		paginationData.lastPage = res.meta.totalPages;
		loading = false;
	};

	const pageChange = async (event: CustomEvent<Paginated>) => {
		loading = false;
		paginationData = event.detail;
		await loadNotes(paginationData.page);
		loading = true;
	};

	onMount(() => {
		notesService = NotesService.getInstance();
		loadNotes(1);

		pageMetadataStore.set({
			title: 'Notes',
		});
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Notes</title>
</svelte:head>

<div class="w-full pb-16">
	{#if !loading}
		<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<a
				class="w-full rounded-lg relative overflow-hidden variant-filled-primary aspect-[3/4] flex flex-col justify-center items-center shadow-lg hover:-translate-y-4 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
				on:click={() => {
					goto('/app/notes/create');
				}}
				href={'/app/notes/create'}
			>
				<div class="font-bold texl-xl sm:text-2xl md:text-4xl lg:text-9xl">+</div>
			</a>
			{#each notes as note}
				<NoteTile {note} />
			{/each}
		</div>
		<div class="mt-8">
			<PaginationBar data={paginationData} on:change={pageChange} />
		</div>
	{/if}
</div>
