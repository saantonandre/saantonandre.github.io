import Epub from "epub-gen";
import path from "path";
import { removeUnnecessaryFiles } from "removeUnnecessaryFiles";
import { convertToEpub } from "convertToEpub";
import { downloadRepo } from "downloadRepo";


const REPO_URL = "https://github.com/trekhleb/javascript-algorithms";
// const REPO_URL = "https://github.com/getify/You-Dont-Know-JS";
const REPO_PATH = path.join(__dirname, "./repo");
const OUTPUT_PATH = path.join(__dirname, "./dist");
const COVER_PATH = path.join(__dirname, "./src/assets/cover.png");

const [author, title] = REPO_URL.split("/").slice(-2);
const options: Omit<Epub.Options, "content"> = {
  version: 3,
  title,
  author,
  cover: COVER_PATH,
  lang: "en",
};

const start = async () => {
  await downloadRepo(REPO_URL, REPO_PATH);
  await removeUnnecessaryFiles(REPO_PATH);
  await convertToEpub(REPO_PATH, OUTPUT_PATH, options);
};
start();
