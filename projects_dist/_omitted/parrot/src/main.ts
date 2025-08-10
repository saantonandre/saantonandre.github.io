import puppeteer, { LaunchOptions } from "puppeteer";
import { launchServer } from "./server.ts";
import { parrot } from "./parrot.ts";

const launchOptions: LaunchOptions = {
  executablePath: process.env["CHROME_PATH"]
    ? process.env["CHROME_PATH"]
    : undefined,
  headless: true,
  args: ["--use-fake-ui-for-media-stream", "--ignore-certificate-errors"],
  ignoreDefaultArgs: ["--mute-audio"],
};

export async function main() {
  const url = await launchServer();
  const browser = await puppeteer.launch(launchOptions);
  const page = (await browser.pages())[0];
  await page.goto(url);
  page
    .on("console", (evt) => console[evt.type()](evt.text()))
    .evaluate(parrot);
}
