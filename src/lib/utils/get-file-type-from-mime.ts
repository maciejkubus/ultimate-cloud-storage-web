import { FileType } from '$lib/enums/file-type.enum';

const getFileTypeFromMimetype = (mimetype: string) => {
	let type: FileType = FileType.FILE;

	if (mimetype.includes('image')) type = FileType.IMAGE;
	else if (mimetype.includes('video')) type = FileType.VIDEO;
	else if (mimetype.includes('audio')) type = FileType.AUDIO;

	return type;
};

export { getFileTypeFromMimetype };
