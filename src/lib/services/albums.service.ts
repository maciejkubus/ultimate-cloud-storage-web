import { config } from '$lib/config';
import type { Album } from '$lib/interfaces/album.interface';
import type { UserStore } from '$lib/interfaces/user-store.interface';
import { userStore } from '$lib/stores/user.store';

export class AlbumsService {
	private static instance: AlbumsService;
	private static user: UserStore;

	constructor() {
		userStore.subscribe((value) => {
			AlbumsService.user = value;
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
				Authorization: 'Bearer ' + AlbumsService.user.access_token,
			},
		});
		return await res.json();
	}

	public async getMyAlbums(): Promise<Album[]> {
		const res = await fetch(config.apiBaseUrl + '/albums/mine', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + AlbumsService.user.access_token,
			},
		});
		const albums = await res.json();
		return albums;
	}

	public async addFilesToAlbum(albumId: number, fileIds: number[]): Promise<Album> {
		const res = await fetch(config.apiBaseUrl + '/albums/' + albumId + '/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + AlbumsService.user.access_token,
			},
			body: JSON.stringify({ files: fileIds }),
		});
		return await res.json();
	}
}
