import { browser } from '$app/environment';
import type { AlbumStore } from '$lib/interfaces/album-store.interface';
import { writable, type Writable } from 'svelte/store';

const defaultAlbum: AlbumStore = {
	albums: [],
};

const albumFromStorage = browser ? window.localStorage.getItem('album') + '' : '';

const initialAlbum: AlbumStore = browser
	? JSON.parse(albumFromStorage) ?? defaultAlbum
	: defaultAlbum;

export const albumStore: Writable<AlbumStore> = writable(initialAlbum);

albumStore.subscribe((album) => {
	if (browser) {
		window.localStorage.setItem('album', JSON.stringify(album));
	}
});
