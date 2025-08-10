import fs from "fs";

/** Creates a list of files contained in folders and subfolders */
export const listFiles = (
  path: string,
  ignore: string[] = ["node_modules"],
  fileCallback?: (filePath: string) => void,
  folderCallback?: (folderPath: string) => void
): string[] => {
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
        folderCallback?.(filePath);
      } else {
        fileCallback?.(filePath);
      }
      return !isFold;
    });
  const otherFiles = folders.map((foldName) =>
    listFiles(foldName, ignore, fileCallback, folderCallback)
  );
  return allFiles.concat(otherFiles.flat());
};
export const isFolder = (path: string) => fs.statSync(path).isDirectory();
