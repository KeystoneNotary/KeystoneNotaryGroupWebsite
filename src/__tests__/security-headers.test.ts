import config from "../../next.config";

describe("security headers", () => {
  it("restricts font delivery to local assets", async () => {
    const headerSets = (await config.headers?.()) || [];
    const globalHeaders = headerSets.find((set) => set.source === "/:path*");
    const csp = globalHeaders?.headers.find((header) => header.key === "Content-Security-Policy");
    const cspValue =
      typeof csp?.value === "string"
        ? csp.value
        : Array.isArray(csp?.value)
          ? csp.value.join("; ")
          : "";

    expect(cspValue).toContain("font-src 'self'");
    expect(cspValue).toContain("style-src 'self'");
    expect(cspValue).not.toMatch(/fonts\.gstatic\.com/);
    expect(cspValue).not.toMatch(/fonts\.googleapis\.com/);
  });
});
