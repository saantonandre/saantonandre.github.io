import Epub from "epub-gen";
import { existsSync, promises as fs } from "fs";
import { listFiles } from "utils/listFiles";
import { createChapter } from "./createChapter";

export async function convertToEpub(
  repoPath: string,
  outputPath: string,
  options: Omit<Epub.Options, "content">
) {
  const chapters: Epub.Chapter[] = await Promise.all(
    listFiles(repoPath)
      .filter((file) => file.split("/").pop() === "README.md")
      .map(createChapter)
  );
  console.log("Generating EPUB...");
  if (!existsSync(outputPath)) {
    await fs.mkdir(outputPath);
  }
  const epub = new Epub(
    { ...options, content: chapters },
    outputPath + "/" + options.title + ".epub"
  );
  await epub.promise;
}
