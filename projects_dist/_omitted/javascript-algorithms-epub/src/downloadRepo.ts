import fs from "fs";
import path from "path";
import cloneRepository from "git-clone";


/**
 * Downloads the content of the source repo to the /repo folder
 */
export async function downloadRepo(
  repoWebURL: string,
  repoPath: string,
) {
  if (!fs.existsSync(repoPath)) {
    fs.mkdirSync(repoPath);
  }
  console.log(`Clearing path ${repoPath}...`);
  fs.rmSync(repoPath, { recursive: true });
  console.log(`Downloading repository "${repoWebURL}"...`);
  await new Promise<void>((resolve) => {
    cloneRepository(repoWebURL, repoPath, undefined, () => resolve());
  });
}


