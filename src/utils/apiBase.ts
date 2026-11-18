// Base for /api calls from services shared by server and browser code.
// Browser: same-origin relative path. Server: internal address from BASE_URL
// (next.config.js), because Node fetch needs an absolute URL.
export const API_BASE = typeof window === "undefined" ? process.env.BASE_URL ?? "" : "";
