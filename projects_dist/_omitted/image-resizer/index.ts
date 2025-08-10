import fs from "fs";
import path from "path";
import sharp from "sharp";

const INPUT_DIR = "./input";
const OUTPUT_DIR = "./output";

const _ratio = Number(process.argv[2]);
const ratio = isNaN(_ratio) ? 1 : _ratio;
console.log(`Resizing images to ${ratio}`);

function toRatio(v: number, r: number) {
  return Math.floor(v * r);
}
const promises = fs
  .readdirSync(INPUT_DIR)
  .filter((img) => img.endsWith(".png"))
  .map(async (name) => {
    const image = sharp(path.join(INPUT_DIR, name));
    const metadata = await image.metadata();
    return image
      .resize(toRatio(metadata.width!, ratio), toRatio(metadata.height!, ratio))
      .png()
      .toFile(path.join(OUTPUT_DIR, name));
  });

await Promise.all(promises);
