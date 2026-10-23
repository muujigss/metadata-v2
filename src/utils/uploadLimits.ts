// Shared by browser validation and server-side file validation.
export const MAX_UPLOAD_SIZE_MB = 50;
export const MAX_UPLOAD_SIZE = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
export const UPLOAD_SIZE_MESSAGE = `Файлын хэмжээ ${MAX_UPLOAD_SIZE_MB} MB-аас хэтэрч болохгүй.`;
