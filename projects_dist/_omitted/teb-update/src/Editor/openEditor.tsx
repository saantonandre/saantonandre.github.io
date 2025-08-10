import { render } from "preact";
import { App } from "./App";
import { MapEditor } from "./MapEditor";
import { editorEvents } from "./MapEditor/events";

export async function openEditor() {
  const app = document.getElementById("app")!;
  const mapEditor = new MapEditor();
  window.mapEditor = mapEditor;
  editorEvents.sub("initialized", () => {
    render(<App />, app);
  });
}