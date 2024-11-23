import { config } from "$lib/config";
import { Expence } from "$lib/interfaces/expence.interface";
import { UserStore } from "$lib/interfaces/user-store.interface";
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
    const res = await fetch(config.apiBaseUrl + '/expences', {
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
}