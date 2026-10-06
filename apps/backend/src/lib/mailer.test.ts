import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.hoisted(() => vi.fn());

vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}));

import { config } from "./config.js";
import { buildResetLink, sendPasswordResetEmail } from "./mailer.js";

describe("mailer", () => {
  beforeEach(() => {
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: "1" });
  });

  it("builds the frontend reset link with the token and the encoded email", () => {
    expect(buildResetLink("ana+test@x.com", "abc123")).toBe(
      `${config.clientOrigin}/recover/confirm?token=abc123&email=ana%2Btest%40x.com`,
    );
  });

  it("sends the email to the recipient from the configured sender", async () => {
    const sent = await sendPasswordResetEmail("ana@x.com", "tok");
    expect(sent).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0]).toMatchObject({ from: config.smtp.from, to: "ana@x.com" });
  });

  it("includes the link and the visible token in both text and HTML bodies", async () => {
    await sendPasswordResetEmail("ana@x.com", "tok123");
    const { text, html } = sendMail.mock.calls[0][0] as { text: string; html: string };
    const link = buildResetLink("ana@x.com", "tok123");
    expect(text).toContain(link);
    expect(text).toContain("tok123");
    expect(html).toContain(link.replace(/&/g, "&amp;"));
    expect(html).toContain("tok123");
  });

  it("escapes HTML special characters in the link", async () => {
    await sendPasswordResetEmail("a&b@x.com", "tok");
    const { html } = sendMail.mock.calls[0][0] as { html: string };
    expect(html).toContain("&amp;");
    expect(html).not.toContain("tok&email");
  });

  it("does not throw when SMTP fails; logs and returns false", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sendMail.mockRejectedValue(new Error("SMTP down"));
    await expect(sendPasswordResetEmail("ana@x.com", "tok")).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("[mailer]"), "SMTP down");
    log.mockRestore();
  });
});
