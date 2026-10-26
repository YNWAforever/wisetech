import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScript } from "./helpers/load-typescript.mjs";

const { chatGPTSignInPath, chatGPTSignOutPath } = await loadTypeScript("app/chatgpt-auth.ts");

for (const [action, buildPath] of [["sign-in", chatGPTSignInPath], ["sign-out", chatGPTSignOutPath]]) {
  test(`${action} preserves a local destination including query and fragment`, () => {
    const target = "/zh/events?topic=AI%2B&from=會員#interest";
    const result = new URL(buildPath(target), "https://app.local");
    assert.equal(result.pathname, action === "sign-in" ? "/signin-with-chatgpt" : "/signout-with-chatgpt");
    assert.equal(result.searchParams.get("return_to"), new URL(target, "https://app.local").pathname + new URL(target, "https://app.local").search + "#interest");
    assert.equal([...result.searchParams].length, 1);
  });

  test(`${action} rejects external, malformed and auth-loop destinations`, () => {
    for (const target of ["", "en/join", "https://evil.example/", "//evil.example/", "/\\evil.example/", "/signin-with-chatgpt", "/signout-with-chatgpt?return_to=/en", "/callback#done", "/en/../callback", "/%2e%2e/callback"]) {
      const result = new URL(buildPath(target), "https://app.local");
      assert.equal(result.searchParams.get("return_to"), "/", target);
    }
  });
}

test("sign-out defaults to the public root", () => {
  assert.equal(chatGPTSignOutPath(), "/signout-with-chatgpt?return_to=%2F");
});
