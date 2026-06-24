import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public/icons/icon-192x192.png");
const output = path.join(root, "public/icons/icon-mark.png");

const source = PNG.sync.read(fs.readFileSync(input));
const { width, height, data } = source;

const bgR = data[0];
const bgG = data[1];
const bgB = data[2];
const hex =
  "#" +
  [bgR, bgG, bgB].map((v) => v.toString(16).padStart(2, "0")).join("");

const mark = new PNG({ width, height });
const threshold = 64;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (width * y + x) << 2;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isYellowBg =
      r > 170 &&
      g > 150 &&
      b < 140 &&
      Math.abs(r - bgR) <= threshold &&
      Math.abs(g - bgG) <= threshold &&
      Math.abs(b - bgB) <= threshold;

    if (isYellowBg) {
      mark.data[i] = 0;
      mark.data[i + 1] = 0;
      mark.data[i + 2] = 0;
      mark.data[i + 3] = 0;
    } else {
      mark.data[i] = r;
      mark.data[i + 1] = g;
      mark.data[i + 2] = b;
      mark.data[i + 3] = 255;
    }
  }
}

fs.writeFileSync(output, PNG.sync.write(mark));
fs.writeFileSync(
  path.join(root, "public/icons/logo-color.txt"),
  hex + "\n"
);
console.log("logo background:", hex);
console.log("wrote", output);
