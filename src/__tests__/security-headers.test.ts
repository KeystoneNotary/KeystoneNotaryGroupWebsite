import config from "../../next.config";

describe("security headers", () => {
  it("restricts font delivery to local assets", async () => {
    const headerSets = (await config.headers?.()) || [];
    const globalHeaders = headerSets.find((set) => set.source === "/:path*");
    const csp = globalHeaders?.headers.find((header) => header.key === "Content-Security-Policy");

    expect(csp?.value).toContain("font-src 'self'");
    expect(csp?.value).toContain("style-src 'self'");
    expect(csp?.value).not.toMatch(/fonts\.gstatic\.com/);
    expect(csp?.value).not.toMatch(/fonts\.googleapis\.com/);
  });
});
