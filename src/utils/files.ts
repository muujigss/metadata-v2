import path from "node:path";
import { MAX_UPLOAD_SIZE, MAX_UPLOAD_SIZE_MB } from "./uploadLimits";

export { MAX_UPLOAD_SIZE } from "./uploadLimits";
const allowedTypes: Record<string, string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".gif": ["image/gif"],
  ".webp": ["image/webp"],
};

export class InvalidUploadError extends Error {}

export function resolveUploadPath(directory: string, filename: string): string {
  if (!filename || filename === "." || filename === ".." || /[<>:"/\\|?*\x00-\x1f\x7f]/.test(filename)) {
    throw new InvalidUploadError("Invalid filename");
  }
  const root = path.resolve(directory);
  const target = path.resolve(root, filename);
  if (path.dirname(target) !== root) throw new InvalidUploadError("Invalid filename");
  return target;
}

export function validateUpload(file: File): void {
  if (!file || typeof file.name !== "string" || typeof file.type !== "string" ||
      typeof file.arrayBuffer !== "function" || !Number.isSafeInteger(file.size) ||
      file.size <= 0 || file.size > MAX_UPLOAD_SIZE) {
    throw new InvalidUploadError(`Файл хоосон эсвэл ${MAX_UPLOAD_SIZE_MB} MB-аас их байна.`);
  }
  resolveUploadPath(".", file.name);
  const types = allowedTypes[path.extname(file.name).toLowerCase()];
  // Some browsers send no MIME type for Office documents.
  if (!types || (file.type && file.type !== "application/octet-stream" && !types.includes(file.type))) {
    throw new InvalidUploadError("Зөвхөн PDF, Word, Excel болон зураг оруулна уу.");
  }
}
