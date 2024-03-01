import FilePreview from '$lib/components/file-preview/file-preview.svelte';
import type { File } from '$lib/interfaces/file.interface';
import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

export const openModalPreview = (file: File) => {
  const modalComponent: ModalComponent = {
    ref: FilePreview,
    props: {
      file,
      imageClass: 'max-w-screen max-h-screen p-8 pointer-events-none',
      videoClass: 'max-w-screen max-h-screen p-8',
      noPreviewClass: 'max-w-screen max-h-screen p-8',
    },
  };
  const modal: ModalSettings = {
    type: 'component',
    component: modalComponent,
  };
  modalStore.trigger(modal);
};