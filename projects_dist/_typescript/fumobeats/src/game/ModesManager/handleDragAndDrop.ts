import { eventStream } from "game/gameEvents";

export function handleDragAndDrop(el: HTMLElement) {
  el.addEventListener("dragenter", function (e) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    // console.log(e,e.dataTransfer?.files.item(0));
    if (!files) return;
    eventStream.post("files-hover-start", { files });
  });
  el.addEventListener("dragleave", function (e) {
    e.preventDefault();
    eventStream.post("files-hover-end");
  });
  el.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  el.addEventListener("drop", function (e) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    eventStream.post("files-hover-end");
    if (!files) return;
    eventStream.post("files-import-request", { files });
  });
}
