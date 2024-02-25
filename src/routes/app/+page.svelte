<script lang="ts">
	import FileTable from '$lib/components/file-table/file-table.svelte';
	import { FilesService } from '$lib/services/files.service';
	import { onMount } from 'svelte';
	import type { File } from '$lib/interfaces/file.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import FileExplorer from '$lib/components/file-explorer/file-explorer.svelte';
	import AlbumExplorer from '$lib/components/album-explorer/album-explorer.svelte';
	import { NotesService } from '$lib/services/notes.service';
	import type { Note } from '$lib/interfaces/note.interface';
	import { goto } from '$app/navigation';
	import NoteTile from '$lib/components/note-tile/note-tile.svelte';

	export let files: File[] = [];
	const filesService = FilesService.getInstance();

	const notesService: NotesService = NotesService.getInstance();
	let notes: Note[] = [];

	onMount(() => {
		pageMetadataStore.set({
			title: 'Home',
		});
		loadFiles();
		loadNotes();
	});

	const loadFiles = async () => {
		const response = await filesService.getAllMineFiles(1);
		files = response.data;
	};

	const loadNotes = async () => {
		notes = [];
		const res = await notesService.getNotes(1);
		notes = res.data.slice(0, 3);
	};
</script>

<h2 class="font-semibold text-4xl mb-8">Recent albums</h2>
<AlbumExplorer paginationVisible={false} />

<h2 class="font-semibold text-4xl mb-8">Recent notes</h2>
<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

<h2 class="font-semibold text-4xl mb-8">Recent files</h2>
<FileExplorer {files} />
