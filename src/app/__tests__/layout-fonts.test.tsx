jest.mock("next/font/local", () => {
  const mock = jest.fn(() => ({ variable: "--mock-font" }));
  return { __esModule: true, default: mock };
});

import localFont from "next/font/local";

describe("RootLayout typography", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads Inter and Playfair from local font assets", async () => {
    await jest.isolateModulesAsync(async () => {
      await import("../layout");
    });

    const mock = localFont as unknown as jest.Mock;
    expect(mock).toHaveBeenCalledTimes(2);

    const configs = mock.mock.calls.map(([config]) => config);

    expect(configs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          variable: "--font-inter",
          display: "swap",
          src: expect.arrayContaining([
            expect.objectContaining({
              path: expect.stringContaining("inter"),
              style: "normal",
            }),
          ]),
        }),
        expect.objectContaining({
          variable: "--font-playfair",
          display: "swap",
          src: expect.arrayContaining([
            expect.objectContaining({
              path: expect.stringContaining("playfair"),
              style: "normal",
            }),
          ]),
        }),
      ])
    );
  });
});
