import { config } from '$lib/config';
import type { LoginData } from '$lib/interfaces/login-data.interface';
import type { RegisterData } from '$lib/interfaces/register-data.interface';
import type { User } from '$lib/interfaces/user.interface';

export class AuthenticationService {
	private static instance: AuthenticationService;

	public static getInstance(): AuthenticationService {
		if (!AuthenticationService.instance) {
			AuthenticationService.instance = new AuthenticationService();
		}
		return AuthenticationService.instance;
	}

	public async login(data: LoginData): Promise<{ access_token: string; user: User }> {
		const { username, password } = data;
		const res = await fetch(config.apiBaseUrl + '/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});

		const body = await res.json();

		if (!res.status.toString().startsWith('2')) {
			throw new Error(body.message || body.messages[0]);
		}

		return body;
	}

	public async register(data: RegisterData): Promise<User> {
		const { username, email, password } = data;
		const res = await fetch(config.apiBaseUrl + '/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				email,
				password,
			}),
		});

		const body = await res.json();

		if (!res.status.toString().startsWith('2')) {
			throw new Error(body.message || body.messages[0]);
		}

		return body;
	}
}
