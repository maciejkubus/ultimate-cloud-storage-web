<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Note } from '$lib/interfaces/note.interface';

	export let note: Note;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString).toLocaleDateString();
		return date;
	};
</script>

<a
	class="w-full rounded-lg relative overflow-hidden variant-filled-primary aspect-[3/4] flex flex-col justify-end shadow-lg hover:-translate-y-4 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
	on:click={() => {
		goto('/app/notes/' + note.id);
	}}
	href={'/app/notes/' + note.id}
>
	<div class="p-4 variant-filled-secondary z-20">
		<div class="font-medium">Created: {formatDate(note.created ? note.created : '')}</div>
		<div class="font-medium">Updated: {formatDate(note.updated ? note.updated : '')}</div>
	</div>

	<div class="p-4 absolute inset-0 z-10">
		{@html note.content}
	</div>
</a>
