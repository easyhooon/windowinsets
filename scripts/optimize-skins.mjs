import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

async function pngFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await pngFiles(path));
    else if (entry.name.endsWith(".png")) files.push(path);
  }
  return files;
}

const force = process.argv.includes("--force");
let converted = 0;
const files = await pngFiles("public/skins");
let next = 0;
async function worker() {
  while (next < files.length) {
    const png = files[next++];
    const webp = png.replace(/\.png$/, ".webp");
    const original = await stat(png);
    const optimized = await stat(webp).catch(() => null);
    if (!force && optimized && optimized.mtimeMs >= original.mtimeMs) continue;
    await new Promise((resolve, reject) => {
      const child = spawn("cwebp", ["-quiet", "-lossless", "-exact", png, "-o", webp], { stdio: "inherit" });
      child.on("error", error => reject(new Error(`Install libwebp (cwebp) to optimize ${png}: ${error.message}`)));
      child.on("exit", code => code === 0 ? resolve() : reject(new Error(`cwebp failed for ${png}`)));
    });
    converted++;
  }
}
await Promise.all(Array.from({ length: 4 }, () => worker()));
console.log(`Generated ${converted} lossless WebP skin assets.`);
