<script lang="ts">
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';

	export let content: string;

	let to = '';
	let subject = '';

	const submit = () => {
		if ($modalStore[0].response)
			$modalStore[0].response({
				to,
				subject,
				content,
			});
		modalStore.close();
	};
</script>

<form
	class="p-8 rounded variant-filled-primary md:max-w-lg md:w-full space-y-2"
	on:submit|preventDefault={submit}
>
	<h3 class="text-xl font-medium">Send an e-mail</h3>
	<div class="w-full">
		<div>To</div>
		<input type="email" minlength="3" maxlength="50" required bind:value={to} class="w-full" />
	</div>
	<div class="w-full">
		<div>Subject</div>
		<input type="text" minlength="3" maxlength="50" required bind:value={subject} class="w-full" />
	</div>
	<div class="w-full">
		<div>Message</div>
		<textarea minlength="3" maxlength="500" required disabled class="w-full resize-none h-48"
			>{content}</textarea
		>
	</div>
	<div class="w-full flex justify-end items-end gap-4">
		<button
			type="button"
			class="btn variant-ghost-secondary"
			on:click|preventDefault={() => modalStore.close()}>Close</button
		>
		<button type="submit" class="btn variant-filled-secondary">Send</button>
	</div>
</form>
