import { Resend } from "resend";

import { createResendClient } from "./email";

jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation((key: string) => ({
      key,
    })),
  };
});

const ORIGINAL_ENV = process.env;

describe("createResendClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.RESEND_API_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws when RESEND_API_KEY is missing", () => {
    expect(() => createResendClient()).toThrow(
      /RESEND_API_KEY is required/i
    );
  });

  it.each([
    "re_123456789",
    "re_123",
    "re-test-key-abc",
    "your_resend_api_key",
    "placeholder_key",
    "test_key_123",
  ])("rejects known placeholder Resend key: %s", (placeholderKey) => {
    process.env.RESEND_API_KEY = placeholderKey;

    expect(() => createResendClient()).toThrow(/placeholder/i);
  });

  it("initializes Resend with the provided key when valid", () => {
    process.env.RESEND_API_KEY = "re_test_live_key_abc";

    const client = createResendClient();

    expect(Resend).toHaveBeenCalledWith("re_test_live_key_abc");
    expect(client).toEqual({ key: "re_test_live_key_abc" });
  });
});
