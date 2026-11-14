import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const skipped = new Set(["node_modules", ".git", "dist", "coverage"]);
const patterns = [
  ["JWT", /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/],
  ["private network URL", /https?:\/\/(?:10\.\d+|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+/],
  ["production origin", /https?:\/\/(?:[\w-]+\.)*(?:tnc\.ir|myholoo\.ir|holoo\.co\.ir|holoo\.ai)\b/],
  ["credential-bearing URL", /https?:\/\/[^\s/"']+:[^\s/"']+@/],
];
const failures = [];
let checked = 0;

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(filename);
      continue;
    }
    const relative = path.relative(process.cwd(), filename);
    if ((entry.name.startsWith(".env") && entry.name !== ".env.example") || /\.(pem|key|pfx|p12|log|zip)$/i.test(entry.name)) {
      failures.push(relative + ": forbidden public-export file");
    }
    if (!/\.(ts|tsx|js|mjs|json|scss|css|html|md|svg)$/i.test(entry.name)) continue;
    const text = await readFile(filename, "utf8");
    checked += 1;
    for (const [label, pattern] of patterns) {
      if (pattern.test(text)) failures.push(relative + ": " + label);
    }
  }
}

await scan(process.cwd());
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Public-export text checks passed for " + checked + " files. Image/privacy and rights review remains manual.");
}
