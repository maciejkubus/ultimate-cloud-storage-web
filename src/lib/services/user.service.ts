import { config } from '$lib/config';
import type { UserStore } from '$lib/interfaces/user-store.interface';
import type { User } from '$lib/interfaces/user.interface';
import { userStore } from '$lib/stores/user.store';
import { logout } from '$lib/utils/logout';

export class UserService {
	private static instance: UserService;
	private static userStore: UserStore;

	constructor() {
		userStore.subscribe((value) => {
			UserService.userStore = value;
		});
	}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

  public async getMe() {
    //http://localhost:3000/api/v1/users/me
    const res = await fetch(config.apiBaseUrl + '/users/me', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + UserService.userStore.access_token,
			},
		});

    if(res.status === 401) {
      logout();
    }

    const body = await res.json();
		return body;
  }

	public async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	): Promise<User> {
		const res = await fetch(config.apiBaseUrl + '/users/' + userId + '/change-password', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${UserService.userStore.access_token}`,
			},
			body: JSON.stringify({
				currentPassword,
				newPassword,
			}),
		});

		const body = await res.json();

		if (!res.status.toString().startsWith('2')) {
			throw new Error(body.message || body.messages[0]);
		}

		return body;
	}
}
