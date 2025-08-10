import path from "path";
import fs from "fs";

const LOCAL_URL_REGEX = /\]\((?!http).*?\)/g;
const OTHER_LANG_REGEX = /(_Read this in other languages:_)((\r\n).*(,|\)))*/g;
const TITLE_REGEX = /^(.*)/;
export async function processMarkdownFile(filePath: string) {
  const markdown = await fs.promises.readFile(filePath, "utf8");
  const title = markdown.match(TITLE_REGEX)?.[0].slice(2) || "";
  const processes: ((filePath: string, md: string) => string)[] = [
    replaceUrls,
    removeOtherLanguages,
    removeTitle,
  ];
  const processedMarkdown = processes.reduce(
    (acc, process) => process(filePath, acc),
    markdown
  );
  return [processedMarkdown, title];
}

function removeTitle(_filePath: string, markdown: string) {
  const matches = markdown.match(TITLE_REGEX);
  return (
    matches?.reduce((acc, match) => acc.replace(match, ""), markdown) ||
    markdown
  );
}
function removeOtherLanguages(_filePath: string, markdown: string) {
  const matches = markdown.match(OTHER_LANG_REGEX);
  return (
    matches?.reduce((acc, match) => acc.replaceAll(match, ""), markdown) ||
    markdown
  );
}

function replaceUrls(filePath: string, markdown: string) {
  console.log("Adjusting image urls...");
  const urls = markdown.match(LOCAL_URL_REGEX) || [];
  const processed = urls.reduce((acc, url) => {
    let mdFile = acc;
    if (url.includes("images/") || url.includes("assets/")) {
      const imageUrl = url.slice(2, -1);
      const folderPathArray = filePath.split("/");
      folderPathArray.pop();
      const resolved = path.resolve(folderPathArray.join("/"), imageUrl);
      console.log(`Replacing ${imageUrl} with ${resolved}`);
      mdFile = mdFile.replaceAll(imageUrl, resolved);
    }
    if (url.includes("src/")) {
      const srcUrl = url.slice(2, -1);
      const urlTitle = srcUrl.split("/").pop() + ".xhtml";
      console.log(`Replacing ${url} with ${urlTitle}`);
      mdFile = mdFile.replaceAll(url, `](${urlTitle})`);
    }
    return mdFile;
  }, markdown);
  return processed;
}
