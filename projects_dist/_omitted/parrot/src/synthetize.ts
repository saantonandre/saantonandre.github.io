import { type Page } from "puppeteer";

export const synthetize = (page: Page, text: string) => {
  return page.evaluate(async (_text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(_text);
    utter.lang = "en-GB";
    synth.speak(utter);
  }, text);
};
