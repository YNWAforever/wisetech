import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// For standalone TS modules only (no relative runtime imports). Use the project's
// declared compiler instead of adding a test runner or depending on Node TS flags.
export async function loadTypeScript(relativePath) {
  const work = new URL("../../work/", import.meta.url);
  await mkdir(work, { recursive: true });
  const directory = await mkdtemp(new URL("test-module-", work));
  try {
    const source = await readFile(new URL(`../../${relativePath}`, import.meta.url), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    const modulePath = `${directory}/module.mjs`;
    // Next exposes extensionless imports to bundlers; native Node ESM needs .js.
    await writeFile(modulePath, outputText.replace(/from "(next\/(?:headers|navigation))"/g, 'from "$1.js"'));
    return await import(pathToFileURL(modulePath).href);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
