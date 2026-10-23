export function organizationLogoUrl(value: string): string {
  const normalized = value.replace(/\\/g, "/");
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const uploadIndex = normalized.lastIndexOf("/uploads/");
  if (uploadIndex >= 0 || normalized.startsWith("uploads/")) {
    const filename = normalized.split("/").filter(Boolean).pop() || "";
    return `/api/download/${encodeURIComponent(decodeURIComponent(filename))}`;
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
