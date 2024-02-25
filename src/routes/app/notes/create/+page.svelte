<script lang="ts">
	import NoteEditor from '$lib/components/note-editor/note-editor.svelte';
	import type { Note } from '$lib/interfaces/note.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { onMount } from 'svelte';

	const note: Note = {
		id: null,
		content: '',
	};

	onMount(() => {
		pageMetadataStore.set({
			title: 'Create a note',
		});
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Create new note</title>
</svelte:head>

<NoteEditor defaultNote={note} />
