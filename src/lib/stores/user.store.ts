import type { UserStore } from '$lib/interfaces/user-store.interface';
import { writable, type Writable } from 'svelte/store';

export const userStore: Writable<UserStore> = writable({
	loggedIn: false,
});
