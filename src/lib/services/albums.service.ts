import { config } from '$lib/config';
import type { AlbumStore } from '$lib/interfaces/album-store.interface';
import type { Album } from '$lib/interfaces/album.interface';
import type { UserStore } from '$lib/interfaces/user-store.interface';
import { albumStore } from '$lib/stores/album.store';
import { userStore } from '$lib/stores/user.store';

export class AlbumsService {
	private static instance: AlbumsService;
	private static userStore: UserStore;
	private static albumStore: AlbumStore;

	constructor() {
		userStore.subscribe((value) => {
			AlbumsService.userStore = value;
		});
		albumStore.subscribe((value) => {
			AlbumsService.albumStore = value;
		});
	}

	public static getInstance(): AlbumsService {
		if (!AlbumsService.instance) {
			AlbumsService.instance = new AlbumsService();
		}
		return AlbumsService.instance;
	}

	public async getAlbum(id: number): Promise<Album> {
		const res = await fetch(config.apiBaseUrl + '/albums/' + id, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + AlbumsService.userStore.access_token,
			},
		});
		return await res.json();
	}

	public async loadMineAlbums(): Promise<Album[]> {
		const res = await fetch(config.apiBaseUrl + '/albums/mine', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + AlbumsService.userStore.access_token,
			},
		});
		const albums = await res.json();
		albumStore.set({
			albums,
		});
		return albums;
	}

	public async getMyAlbums(): Promise<Album[]> {
		await this.loadMineAlbums();
		return AlbumsService.albumStore.albums;
	}

	public async addFilesToAlbum(albumId: number, fileIds: number[]): Promise<Album> {
		const res = await fetch(config.apiBaseUrl + '/albums/' + albumId + '/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + AlbumsService.userStore.access_token,
			},
			body: JSON.stringify({ files: fileIds }),
		});
		return await res.json();
	}
}
