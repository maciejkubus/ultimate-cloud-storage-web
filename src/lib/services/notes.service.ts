import { config } from "$lib/config";
import type { Note } from "$lib/interfaces/note.interface";
import type { PaginatedResponse } from "$lib/interfaces/paginated-response.interdace";
import type { UserStore } from "$lib/interfaces/user-store.interface";
import { userStore } from "$lib/stores/user.store";

export class NotesService {
	private static instance: NotesService;
	private static user: UserStore;

	constructor() {
		userStore.subscribe((value) => {
			NotesService.user = value;
		});
	}

	public static getInstance(): NotesService {
		if (!NotesService.instance) {
			NotesService.instance = new NotesService();
		}
		return NotesService.instance;
	}

  async create(content: string): Promise<Note> {
    const res = await fetch(config.apiBaseUrl + '/note', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + NotesService.user.access_token,
			},
      body: JSON.stringify({
        content,
      })
		});

    const note = res.json();

    return note;
  }

  async update(id: number, content: string): Promise<Note> {
    const res = await fetch(config.apiBaseUrl + '/note/' + id, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + NotesService.user.access_token,
			},
      body: JSON.stringify({
        content,
      })
		});

    const note = res.json();

    return note;
  }

  async getNotes(page: number): Promise<PaginatedResponse<Note[]>> {
    const res = await fetch(config.apiBaseUrl + '/note/mine?page=' + page, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + NotesService.user.access_token,
			},
		});

    const notes = res.json();

    return notes;
  }

  async getNote(id: number): Promise<Note> {
    const res = await fetch(config.apiBaseUrl + '/note/' + id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + NotesService.user.access_token,
			},
		});

    const note = res.json();

    return note;
  }

  async delete(id: number) {
    await fetch(config.apiBaseUrl + '/note/' + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + NotesService.user.access_token,
			},
		});
  }
}