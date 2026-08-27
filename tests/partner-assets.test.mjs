import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const partnerRoot = path.resolve("public/partners");
const categories = ["supporting", "regional", "media"];

test("all 79 partner logos use the normalized transparent HD canvas", async () => {
  const files = (
    await Promise.all(
      categories.map(async (category) => {
        const names = await readdir(path.join(partnerRoot, category));
        return names
          .filter((name) => name.endsWith(".png"))
          .map((name) => path.join(partnerRoot, category, name));
      }),
    )
  ).flat();

  assert.equal(files.length, 79);

  for (const file of files) {
    const png = await readFile(file);
    assert.equal(png.toString("ascii", 1, 4), "PNG", `${file} is not a PNG`);
    assert.equal(png.readUInt32BE(16), 960, `${file} has the wrong width`);
    assert.equal(png.readUInt32BE(20), 606, `${file} has the wrong height`);
    assert.equal(png[25], 6, `${file} is not RGBA`);
  }
});
