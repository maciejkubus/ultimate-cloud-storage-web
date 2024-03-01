<script lang="ts">
	import { Editor } from '@tadashi/svelte-editor-quill';
	import type { Note } from '$lib/interfaces/note.interface';
	import { onMount } from 'svelte';
	import { NotesService } from '$lib/services/notes.service';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { goto } from '$app/navigation';
	import {
		toastStore,
		type ModalComponent,
		type ModalSettings,
		modalStore,
	} from '@skeletonlabs/skeleton';
	import SendAlt from 'carbon-icons-svelte/lib/SendAlt.svelte';
	import NoteMail from '../note-mail/note-mail.svelte';

	export let defaultNote: Note;

	let note: Note;
	let noteTextRaw: string = '';
	let saving = false;
	let timeout: NodeJS.Timeout | number = 0;
	let notesService: NotesService;

	onMount(() => {
		note = defaultNote;
		noteTextRaw = (note.content + '').replace(/<[^>]+>/g, '');
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
		noteTextRaw = event.detail.text;
		clearTimeout(timeout);
		timeout = setTimeout(save, 1000);
	};

	const deleteNote = async () => {
		if (!note.id) return;

		saving = true;
		await notesService.delete(note.id);
		goto('/app/notes');
	};

	const sendMail = async () => {
		const modalComponent: ModalComponent = {
			ref: NoteMail,
			props: {
				content: noteTextRaw,
			},
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
			response(r) {
				if (!r) return;
				notesService.sendMail(r);
			},
		};
		modalStore.trigger(modal);
	};
</script>

<div class="h-full pb-12">
	<div class="w-full mb-4">
		<button class="btn variant-filled-secondary" on:click={() => deleteNote()}>
			<TrashCan size={20} class="mr-4" /> Delete note
		</button>
		<button class="btn variant-filled-secondary ml-4" on:click={() => sendMail()}>
			<SendAlt size={20} class="mr-4" /> Send as E-Mail
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
