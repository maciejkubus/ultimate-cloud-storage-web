import { browser } from '$app/environment';
import type { UserStore } from '$lib/interfaces/user-store.interface';
import { writable, type Writable } from 'svelte/store';

const defaultUser: UserStore = {
	loggedIn: false,
	access_token: '',
	user: {
		id: '',
		username: '',
		email: '',
		created: '',
		updated: '',
	},
  preferences: {
    view: 'table'
  }
};

const userFromStorage = browser ? window.localStorage.getItem('user') + '' : '';

const initialUser: UserStore = browser ? JSON.parse(userFromStorage) ?? defaultUser : defaultUser;

export const userStore: Writable<UserStore> = writable(initialUser);

userStore.subscribe((user) => {
	if (browser) {
		window.localStorage.setItem('user', JSON.stringify(user));
	}
});
