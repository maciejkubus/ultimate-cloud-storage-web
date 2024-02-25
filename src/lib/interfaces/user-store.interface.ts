import type { User } from './user.interface';

export interface UserStore {
	loggedIn: boolean;
	access_token: string;
	user: User;
  preferences: {
    view: 'table' | 'grid';
  }
}
