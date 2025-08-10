import Epub from "epub-gen";
import Showdown from "showdown";
import { processMarkdownFile } from "./processMarkdownFile";

const converterOptions: Showdown.ConverterOptions = {
  tables: true,
  strikethrough: true,
  ghCodeBlocks: true,
  tasklists: true,
  simpleLineBreaks: true,
  ghMentions: true,
  emoji: true,
  underline: true,
  appendChapterTitles: true,
};
const mdConverter = new Showdown.Converter(converterOptions);
export async function createChapter(filePath: string) {
  console.log("Processing markdown files...");
  const [markdown, title] = await processMarkdownFile(filePath);
  const fileName = filePath.split("/").slice(-2, -1).pop();
  const chapter: Epub.Chapter = {
    title,
    filename: fileName,
    data: mdConverter.makeHtml(markdown),
  };
  return chapter;
}
