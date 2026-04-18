/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

// Helper: build a NextRequest pointing at the given pathname
function makeRequest(pathname: string, sessionCookie?: string): NextRequest {
  const url = `http://localhost${pathname}`;
  const request = new NextRequest(url);
  if (sessionCookie !== undefined) {
    request.cookies.set("session", sessionCookie);
  }
  return request;
}

describe("middleware", () => {
  it("allows non-admin routes through without a session", () => {
    const response = middleware(makeRequest("/"));
    expect(response.status).not.toBe(307);
  });

  it("redirects unauthenticated request to /admin/dashboard to /admin/login", () => {
    const response = middleware(makeRequest("/admin/dashboard"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin/login");
  });

  it("preserves the intended destination in the redirect URL", () => {
    const response = middleware(makeRequest("/admin/projects"));
    const location = response.headers.get("location") ?? "";
    expect(location).toContain("redirect=%2Fadmin%2Fprojects");
  });

  it("allows /admin/login through without a session", () => {
    const response = middleware(makeRequest("/admin/login"));
    expect(response.status).not.toBe(307);
  });

  it("allows authenticated request to /admin/dashboard through", () => {
    const response = middleware(makeRequest("/admin/dashboard", "some-token"));
    // Should NOT be a redirect
    expect(response.status).not.toBe(307);
  });

  it("allows authenticated request to /admin/projects through", () => {
    const response = middleware(makeRequest("/admin/projects", "some-token"));
    expect(response.status).not.toBe(307);
  });

  it("redirects when session cookie is an empty string", () => {
    const response = middleware(makeRequest("/admin/dashboard", ""));
    expect(response.status).toBe(307);
  });
});
