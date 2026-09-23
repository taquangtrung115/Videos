#!/usr/bin/env node
import { config } from "dotenv";
config({ path: ".env.local" });

import { existsSync } from "node:fs";
import { join } from "node:path";

if (process.platform === "win32") {
  const localAppData = process.env.LOCALAPPDATA || "";
  const wingetFFmpeg = [
    join(localAppData, "Microsoft", "WinGet", "Packages", "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe", "ffmpeg-9.0.2-full_build", "bin"),
    join(localAppData, "Microsoft", "WinGet", "Packages", "Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe", "ffmpeg-9.0.1-essentials_build", "bin"),
  ];
  for (const p of wingetFFmpeg) {
    if (existsSync(p) && !process.env.PATH?.includes(p)) {
      process.env.PATH = `${p};${process.env.PATH}`;
    }
  }
}

import { runPipeline } from "./pipeline.js";
import { log } from "./utils/logger.js";

async function main() {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    console.error("Usage: npm run pipeline -- <path/to/script.json>");
    process.exit(2);
  }
  try {
    await runPipeline(scriptPath);
  } catch (e) {
    log.error("Pipeline failed", e);
    process.exit(1);
  }
}

main();
