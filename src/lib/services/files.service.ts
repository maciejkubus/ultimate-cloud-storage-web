import { config } from '$lib/config';
import type { File as UserFile } from '$lib/interfaces/file.interface';
import type { PaginatedResponse } from '$lib/interfaces/paginated-response.interdace';
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

	public async getFileBlob(id: number, name: string): Promise<Blob> {
		const res = await fetch(config.apiBaseUrl + '/files/' + id + '/download', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});

		const blob = await res.blob();
		return blob;
	}

	public async getAllMineFiles(page: number): Promise<PaginatedResponse<UserFile[]>> {
		const res = await fetch(config.apiBaseUrl + '/files/mine?page=' + page, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});
		const files = await res.json();
		return files;
	}

  public async getFilesByAlbumId(albumId: number, page = 0): Promise<PaginatedResponse<UserFile[]>> {
		const res = await fetch(config.apiBaseUrl + '/files/mine?page=' + page + '&filter.album.id=$eq:' + albumId, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});
		const body = await res.json();
		return body;
	}

	public async deleteFile(id: number): Promise<boolean> {
		const res = await fetch(config.apiBaseUrl + '/files/' + id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
		});
		if (res.status !== 200) {
			throw new Error('Error deleting file');
		}
		return true;
	}

	public async deleteFiles(ids: number[]): Promise<boolean> {
		for (const id of ids) {
			const fileDeleted = await this.deleteFile(id);
			if (!fileDeleted) return false;
		}
		return true;
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

	public async removeFileFromAlbum(fileId: number, albumId: number): Promise<boolean> {
		const res = await fetch(config.apiBaseUrl + '/albums/' + albumId + '/remove', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + FilesService.user.access_token,
			},
			body: JSON.stringify({
				files: [fileId],
			}),
		});

		if (!res.status.toString().startsWith('2')) {
			throw new Error('Error removing file from album');
		}

		return true;
	}
}
