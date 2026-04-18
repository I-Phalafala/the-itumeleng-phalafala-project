import { SESSION_COOKIE_NAME } from "@/constants/auth";

/** Clears the admin session cookie. */
export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Sets the admin session cookie with the given token value.
 * The `Secure` attribute is added automatically in production.
 */
export function setSessionCookie(token: string): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE_NAME}=${token}; path=/; SameSite=Strict${secure}`;
}

/**
 * Returns a safe redirect path from a raw redirect string.
 * Only paths that start with `/admin/` (but not `/admin/login`) are allowed.
 * Falls back to `/admin/dashboard` for any other value.
 */
export function getSafeAdminRedirect(raw: string | null): string {
  const fallback = "/admin/dashboard";
  if (!raw) return fallback;
  // Only allow paths that are within the admin area and not the login page itself
  if (raw.startsWith("/admin/") && !raw.startsWith("/admin/login")) {
    return raw;
  }
  return fallback;
}
