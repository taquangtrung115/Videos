// Post-render step: mixes all audio lines into the rendered MP4 video
// if hyperframes outputs video-only.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ffmpegPath = path.join(ROOT, "node_modules", ".bin", "ffmpeg.exe");

async function main() {
  const rendersDir = path.join(ROOT, "renders");
  if (!fs.existsSync(rendersDir)) return;

  const files = fs.readdirSync(rendersDir).filter(f => f.endsWith(".mp4") && f !== "dev-vs-devops.mp4");
  if (files.length === 0) return;

  // sort by mtime desc
  files.sort((a, b) => {
    return fs.statSync(path.join(rendersDir, b)).mtimeMs - fs.statSync(path.join(rendersDir, a)).mtimeMs;
  });

  const latestVideo = path.join(rendersDir, files[0]);
  const durationsPath = path.join(ROOT, "assets", "vo", "durations.json");
  if (!fs.existsSync(durationsPath)) return;

  const durations = JSON.parse(fs.readFileSync(durationsPath, "utf8"));
  const gaps = {
    2: 0.35, 3: 0.45, 4: 0.40, 5: 0.30, 6: 0.30,
    7: 0.45, 8: 0.30, 9: 0.30, 10: 0.45, 11: 0.30, 12: 0.45
  };

  const lineStarts = {};
  let cur = 0.55;
  lineStarts[1] = cur;
  for (let i = 2; i <= 12; i++) {
    cur = cur + durations[`line-${i-1}`] + gaps[i];
    lineStarts[i] = cur;
  }

  const inputs = [];
  const delays = [];
  for (let i = 1; i <= 12; i++) {
    inputs.push("-i", path.join(ROOT, "assets", "vo", `line-${i}.mp3`));
    const ms = Math.round(lineStarts[i] * 1000);
    delays.push(`[${i-1}:a]adelay=${ms}|${ms}[a${i-1}]`);
  }

  const mixInputs = Array.from({ length: 12 }, (_, i) => `[a${i}]`).join("");
  const filterComplex = `${delays.join(";")};${mixInputs}amix=inputs=12:dropout_transition=0[aout]`;
  const mixPath = path.join(ROOT, "assets", "vo", "full-mix.mp3");

  console.log("Generating full audio mix...");
  await execFileAsync(ffmpegPath, [
    "-y",
    ...inputs,
    "-filter_complex", filterComplex,
    "-map", "[aout]",
    mixPath
  ]);

  const finalMp4 = path.join(rendersDir, "dev-vs-devops.mp4");
  console.log(`Muxing audio into final MP4: ${finalMp4}`);
  await execFileAsync(ffmpegPath, [
    "-y",
    "-i", latestVideo,
    "-i", mixPath,
    "-c:v", "copy",
    "-c:a", "aac",
    "-shortest",
    finalMp4
  ]);

  console.log("Postrender complete: renders/dev-vs-devops.mp4 ready.");
}

main().catch(err => {
  console.error("Postrender error:", err);
});
