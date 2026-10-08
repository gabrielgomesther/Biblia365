import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const ignored = new Set(["sw.js", "precache-manifest.json"]);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(absolute));
    else if (entry.isFile() && !ignored.has(entry.name)) {
      files.push(path.relative(root, absolute).split(path.sep).join("/"));
    }
  }
  return files;
}

const files = (await collect(root)).sort();
if (!files.includes("index.html")) throw new Error("dist/index.html ausente; build incompleto.");

const hash = createHash("sha256");
for (const file of files) {
  hash.update(file);
  hash.update(await readFile(path.join(root, file)));
}
const buildId = hash.digest("hex").slice(0, 12);

await writeFile(path.join(root, "precache-manifest.json"), `${JSON.stringify({ buildId, files }, null, 2)}\n`);
const serviceWorkerPath = path.join(root, "sw.js");
const serviceWorker = await readFile(serviceWorkerPath, "utf8");
if (!serviceWorker.includes("__BUILD_ID__")) throw new Error("Marcador de versão do Service Worker ausente.");
await writeFile(serviceWorkerPath, serviceWorker.replaceAll("__BUILD_ID__", buildId));
console.log(`Precache offline gerado: ${files.length} arquivos (build ${buildId}).`);
