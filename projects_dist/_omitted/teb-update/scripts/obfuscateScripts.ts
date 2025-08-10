import fs from "fs";
import path from "path";
import JavaScriptObfuscator, { ObfuscatorOptions } from "javascript-obfuscator";

/** Domain whitelist for code execution */
const domainLock = [
  "https://saantonandre.github.io",
  "http://localhost:3000",
  "https://saantonandre.itch.io",
];
/**  https://github.com/javascript-obfuscator/javascript-obfuscator#javascript-obfuscator-options */
const obfuscatorConfig: ObfuscatorOptions = {
  domainLock,
};

export async function obfuscateScripts(targetFolder: string) {
  // Find every metadata path in the builds folder
  const files = listFiles(targetFolder);
  const jsFilePaths = files.filter((filePath) => {
    const isJS = path.extname(filePath) === ".js";
    if (!isJS) return false;
    const isWorker = filePath.split("/").pop()?.includes("worker");
    if (isWorker) return false;
    return true;
  });
  jsFilePaths.forEach((jsFilePath) => {
    const fileContent = fs.readFileSync(jsFilePath, "utf8");
    const obfuscated = JavaScriptObfuscator.obfuscate(
      fileContent,
      obfuscatorConfig
    ).getObfuscatedCode();
    fs.writeFileSync(jsFilePath, obfuscated);
  });
  console.log(
    `Obfuscated ${jsFilePaths.length} javascript files found across ${files.length} items.`
  );
}
/** Creates a list of files contained in folders and subfolders */
export function listFiles(
  path: string,
  ignore: string[] = ["node_modules", ".git"]
): string[] {
  const files = fs.readdirSync(path);
  const folders: string[] = [];
  const allFiles = files
    .map((filePath) => path + "/" + filePath)
    .filter(async (filePath) => {
      const isFold = isFolder(filePath);
      const fileName = filePath.split("/").pop();
      if (ignore.includes(String(fileName))) return false;
      if (isFold) {
        folders.push(filePath);
      }
      return !isFold;
    });
  const otherFiles = folders.map((foldName) => listFiles(foldName, ignore));
  return allFiles.concat(otherFiles.flat());
}
export function isFolder(path: string) {
  return fs.statSync(path).isDirectory();
}
