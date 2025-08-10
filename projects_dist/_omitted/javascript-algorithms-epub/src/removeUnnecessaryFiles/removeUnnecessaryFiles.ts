import { listFiles } from "utils/listFiles";
import fs from "fs";

export async function removeUnnecessaryFiles(repoPath:string) {
    console.log(`Removing unnecessary files...`);
    let removedFiles = 0;
    let removedFolders = 0;
    const folders: string[] = [];
    listFiles(
      repoPath,
      undefined,
      (filePath) => {
        const isAssetFile = filePath.includes("/assets/");
        const isPlayground = filePath.includes("/playground/");
        const isImageFile = filePath.includes("/images/");
        const isEngReadme = filePath.split("/").pop() === "README.md";
        if (!(isImageFile || isAssetFile || isEngReadme) || isPlayground) {
          removedFiles++;
          fs.rmSync(filePath);
        }
      },
      (folderPath) => folders.push(folderPath)
    );
    console.log(`Removing empty directories...`);
    folders
      .filter((folder) => fs.readdirSync(folder).length === 0)
      .sort((a, b) => (a.length < b.length ? 1 : -1))
      .forEach((folder) => {
        removedFolders++;
        fs.rmSync(folder, { recursive: true });
      });
    console.log(
      `Removed ${removedFiles} files and ${removedFolders} directories`
    );
  }