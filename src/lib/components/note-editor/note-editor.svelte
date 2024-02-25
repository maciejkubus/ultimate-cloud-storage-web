<script lang="ts">
	import { Editor } from '@tadashi/svelte-editor-quill';
	import type { Note } from '$lib/interfaces/note.interface';
	import { onMount } from 'svelte';
	import { NotesService } from '$lib/services/notes.service';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { goto } from '$app/navigation';
	import { toastStore } from '@skeletonlabs/skeleton';

	export let defaultNote: Note;

	let note: Note;
	let saving = false;
	let timeout: number = 0;
	let notesService: NotesService;

	onMount(() => {
		note = defaultNote;
		notesService = NotesService.getInstance();
	});

	const options = {
		theme: 'snow',
		plainclipboard: true,
		placeholder: 'Type here',
		modules: {
			toolbar: [
				['bold', 'italic'],
				['link', 'blockquote', 'code-block', 'image'],
				[{ list: 'ordered' }, { list: 'bullet' }],
			],
		},
	};

	const save = async () => {
		if (saving) return;

		saving = true;
		if (note.id) {
			await notesService.update(note.id, note.content);
		} else {
			const newNote = await notesService.create(note.content);
			note.id = newNote.id;
		}
		toastStore.trigger({
			message: `Note saved`,
			timeout: 2500,
		});
		saving = false;
	};

	const onTextChange = (event: any) => {
		note.content = event.detail.html;
		clearTimeout(timeout);
		timeout = setTimeout(save, 1000);
	};

	const deleteNote = async () => {
		if (!note.id) return;

		saving = true;
		await notesService.delete(note.id);
		goto('/app/notes');
	};
</script>

<div class="h-full pb-12">
	<div class="w-full mb-4">
		<button class="btn variant-filled-secondary" on:click={() => deleteNote()}>
			<TrashCan size={20} class="mr-4" /> Delete note
		</button>
	</div>
	<Editor
		{options}
		on:text-change={onTextChange}
		data={defaultNote.content}
		class="h-full flex flex-col variant-filled-primary"
	/>
	<div class="w-full h-12 py-4 text-lg text-right">
		{saving ? 'Saving' : ''}
	</div>
</div>
