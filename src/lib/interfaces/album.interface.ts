import type { File } from './file.interface';
import type { User } from './user.interface';

export interface Album {
	id: number;
	created: string;
	updated: string;
	title: string;
	user: User;
	files: File[];
	thumbnail?: File;
}
