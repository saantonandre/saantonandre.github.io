import JSZip from "jszip";
import path from "path";
import fs from "fs";
import { listFiles } from "./obfuscateScripts";

/**
 * Zips the contents of a folder
 * @param folderPath - The path of the folder to zip
 * @param outputFilePath - The output path of the zip file
 */
export async function zipFolder(folderPath: string, outputFilePath: string) {
  const zip = new JSZip();
  const files = listFiles(folderPath);
  console.log(files);
  for (const file of files) {
    const relativePath = path.relative(folderPath, file);
    const stats = fs.statSync(file);
    if (stats.isDirectory()) continue;
    zip.file(relativePath, fs.readFileSync(file));
  }
  const zipContent = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(outputFilePath, zipContent);
}
