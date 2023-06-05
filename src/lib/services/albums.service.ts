import { config } from '$lib/config';
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

	public async getAlbum(id: number) {
		const res = await fetch(config.apiBaseUrl + '/albums/' + id, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + AlbumsService.user.access_token,
			},
		});
		return await res.json();
	}
}
