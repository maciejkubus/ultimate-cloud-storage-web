import { config } from "$lib/config";
import { type Expence } from "$lib/interfaces/expence.interface";
import type { PaginatedResponse } from "$lib/interfaces/paginated-response.interdace";
import { type UserStore } from "$lib/interfaces/user-store.interface";
import { userStore } from "$lib/stores/user.store";

export class ExpencesService {
	private static instance: ExpencesService;
	private static user: UserStore;

	constructor() {
		userStore.subscribe((value) => {
			ExpencesService.user = value;
		});
	}

	public static getInstance(): ExpencesService {
		if (!ExpencesService.instance) {
			ExpencesService.instance = new ExpencesService();
		}
		return ExpencesService.instance;
	}

  async create(content: Expence): Promise<Expence> {
    const res = await fetch(config.apiBaseUrl + '/expenses', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + ExpencesService.user.access_token,
			},
      body: JSON.stringify(content)
		});

    const expence = res.json();

    return expence;
  }

  async getExpences(page: number): Promise<PaginatedResponse<Expence[]>> {
    const res = await fetch(config.apiBaseUrl + '/expenses?page=' + page, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + ExpencesService.user.access_token,
			},
		});

    const expenses = res.json();
    return expenses;
  }

  //date: YYYY-MM
  async getExpencesInMonth(page: number, date: string): Promise<PaginatedResponse<Expence[]>> {
    const res = await fetch(config.apiBaseUrl + '/expenses/month/'+ date +'?page=' + page, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + ExpencesService.user.access_token,
			},
		});

    const expenses = res.json();
    return expenses;
  }

  async getStats() {
    const res = await fetch(config.apiBaseUrl + '/expenses/stats', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + ExpencesService.user.access_token,
			},
		});

    const data = res.json();
    return data;
  }

  async delete(id: number) {
    await fetch(config.apiBaseUrl + '/expenses/' + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + ExpencesService.user.access_token,
			},
		});
  }
}