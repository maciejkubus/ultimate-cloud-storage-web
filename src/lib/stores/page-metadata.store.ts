import { browser } from '$app/environment';
import type { PageMetadataStore } from '$lib/interfaces/page-metadata.inerface';
import { writable, type Writable } from 'svelte/store';

const defaultPageMetadata: PageMetadataStore = {
	title: '',
};

const pageMetadataFromStorage = browser ? window.localStorage.getItem('page-metadata') + '' : '';

const initialPageMetadata: PageMetadataStore = browser
	? JSON.parse(pageMetadataFromStorage) ?? defaultPageMetadata
	: defaultPageMetadata;

export const pageMetadataStore: Writable<PageMetadataStore> = writable(initialPageMetadata);

pageMetadataStore.subscribe((album) => {
	if (browser) {
		window.localStorage.setItem('page-metadata', JSON.stringify(album));
	}
});
