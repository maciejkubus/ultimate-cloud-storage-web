import type { FileType } from '$lib/enums/file-type.enum';

export interface AccesibleFile {
	type: FileType;
	src: string;
	alt: string;
}
