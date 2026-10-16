import { describe, it, expect } from "vitest";
import { setLoginCookie, clearLoginCookie } from "./session";

describe("session cookie", () => {
  it("menyetel cookie login", () => {
    setLoginCookie();
    expect(document.cookie).toContain("delcom_logged_in=1");
  });

  it("menghapus cookie login", () => {
    setLoginCookie();
    clearLoginCookie();
    expect(document.cookie).not.toContain("delcom_logged_in=1");
  });
});