import { config } from '$lib/config';
import type { File as UserFile } from '$lib/interfaces/file.interface';
import type { UserStore } from '$lib/interfaces/user-store.interface';
import { userStore } from '$lib/stores/user.store';

export class FilesService {
	private static instance: FilesService;
	private static user: UserStore;

	constructor() {
		userStore.subscribe((value) => {
			FilesService.user = value;
		});
	}

	public static getInstance(): FilesService {
		if (!FilesService.instance) {
			FilesService.instance = new FilesService();
		}
		return FilesService.instance;
	}

	public async downloadFile(id: number, name: string): Promise<void> {
		const res = await fetch(config.apiBaseUrl + '/files/' + id + '/download', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});

		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	public async getAllMineFiles(): Promise<UserFile[]> {
		const res = await fetch(config.apiBaseUrl + '/files/mine', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});
		const files = await res.json();
		return files;
	}

	public async deleteFile(id: number): Promise<void> {
		const res = await fetch(config.apiBaseUrl + '/files/' + id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});
		if (res.status !== 200) {
			throw new Error('Error deleting file');
		}
	}

	public async uploadFile(file: File): Promise<UserFile> {
		const formData = new FormData();
		formData.append('file', file);

		const res = await fetch(config.apiBaseUrl + '/files', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
			body: formData,
		});

		const body = await res.json();

		if (!res.status.toString().startsWith('2')) {
			throw new Error(body.message || body.messages[0]);
		}

		return body;
	}
}
