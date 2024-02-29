import type { File } from '$lib/interfaces/file.interface';
import { FilesService } from '$lib/services/files.service';
import { getFileTypeFromMimetype } from './get-file-type-from-mime';

const createAccesibleFile = async (file: File, access: 'private' | 'public' = 'private') => {
	const filesService = FilesService.getInstance();
	const blob = await filesService.getFileBlob(file?.id || 0, file?.originalName || '', access);
	const URLObject = URL.createObjectURL(blob);

	const type = getFileTypeFromMimetype(file?.mimetype || '');
	const alt = file?.originalName || '';
	const src = URLObject;

	return {
		type,
		alt,
		src,
	};
};

export { createAccesibleFile };

