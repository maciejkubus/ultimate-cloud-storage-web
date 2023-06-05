<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import CloudUpload from 'carbon-icons-svelte/lib/CloudUpload.svelte';

	const file = {
		name: '',
		size: 0,
		type: '*/*',
		lastModified: 0,
	};

	const fileChange = (event: any) => {
		const tempFile = event?.target?.files[0];
		if (!tempFile) return;

		file.name = tempFile.name;
		file.size = tempFile.size;
		file.type = tempFile.type;
		file.lastModified = tempFile.lastModified;
	};
</script>

<div class="p-4 flex">
	<FileDropzone name="files" on:change={fileChange}>
		<svelte:fragment slot="lead" />
		<svelte:fragment slot="message">
			{#if file.size < 1}
				<strong>Upload a file</strong> or drag and drop
			{:else}
				<strong>Click or drag files here to upload</strong>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="meta">
			{#if file.size < 1}
				max. 100 MB
			{:else}
				{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
			{/if}
		</svelte:fragment>
	</FileDropzone>
</div>
