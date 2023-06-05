<script lang="ts">
	import { FileDropzone, toastStore } from '@skeletonlabs/skeleton';
	import { FilesService } from '$lib/services/files.service';

	const filesService = FilesService.getInstance();

	let files: FileList;
	let uploading = false;

	const fileChange = async (event: any) => {
		if (uploading) return;

		const tempFile = event?.target?.files[0];
		if (!tempFile) return;

		uploading = true;
		try {
			await filesService.uploadFile(tempFile);
			toastStore.trigger({
				message: 'Your file has been uploaded successfully',
			});
		} catch (error) {
			toastStore.trigger({
				message: error + '',
				background: 'variant-filled-error',
			});
		}
		uploading = false;
	};

	const submit = () => {};
</script>

<div class="p-4 flex">
	<form class="contents" on:submit|preventDefault={submit} enctype="multipart/form-data">
		<FileDropzone name="files" on:change={fileChange} bind:files>
			<svelte:fragment slot="lead" />
			<svelte:fragment slot="message">
				{#if uploading}
					<strong>Uploading </strong>
				{:else}
					<strong>Click or drag files here to upload</strong>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="meta">
				{#if uploading}
					{files[0].name} ({(files[0].size / 1024 / 1024).toFixed(2)} MB)
				{:else}
					max. 100 MB
				{/if}
			</svelte:fragment>
		</FileDropzone>
	</form>
</div>
