/// <reference types="vite/client" />
declare module "*.bin?arraybuffer" {
  const content: ArrayBuffer;
  export default content;
}
declare interface Window {
  mapEditor: import("./Editor/MapEditor").MapEditor;
}
