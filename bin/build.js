import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { zipDirectory } from "./zip.js";
import fsExtra from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ctx = await esbuild.context({
  entryPoints: [
    "src/scripts/content.ts",
    "src/test/index.ts",
    "src/scripts/popup.ts",
    "src/scripts/background.ts",
    "src/styles/popup.css",
    // "src/styles/ui.css",
  ],
  bundle: true,
  outdir: "dist",
  sourcemap: true,
});

// Use the function to copy popup.html
copyFile(
  path.join(__dirname, "../src/popup.html"),
  path.join(__dirname, "../dist/popup.html")
);

copyFile(
  path.join(__dirname, "../src/manifest.json"),
  path.join(__dirname, "../dist/manifest.json")
);

await copyDirectory(
  path.join(__dirname, "../src/images"),
  path.join(__dirname, "../dist/images")
);

await zipDirectory(
  path.join(__dirname, "../dist"),
  path.join(__dirname, "../dist/package.zip")
);

await ctx.watch();
await ctx.serve({
  port: 3000,
  servedir: "dist",
});

// This function copies the source file to the destination
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
}

async function copyDirectory(source, destination) {
  try {
    await fsExtra.copy(source, destination);
  } catch (err) {
    console.error(err);
  }
}
