<script lang="ts">
	import { page } from '$app/stores';
	import NoteEditor from '$lib/components/note-editor/note-editor.svelte';
	import type { Note } from '$lib/interfaces/note.interface';
	import { NotesService } from '$lib/services/notes.service';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	let notesService: NotesService;
	let loading = true;

	const note: Note = {
		id: null,
		content: '',
	};

	onMount(async () => {
		note.id = +$page.params.id;
		notesService = NotesService.getInstance();
		const newNote = await notesService.getNote(note.id);
		note.content = newNote.content;
		loading = false;

		pageMetadataStore.set({
			title: 'Edit a note',
		});
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Edit a note</title>
</svelte:head>

{#if !loading}
	<NoteEditor defaultNote={note} />
{/if}
