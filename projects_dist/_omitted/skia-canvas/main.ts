import {WindowOptions} from "./skia.ts";
// https://raw.githubusercontent.com/saantonandre/skia-canvas/refs/heads/main/lib/index.js

//https://cdn.jsdelivr.net/gh/saantonandre/skia-canvas/lib/index.js
const windowConfig: WindowOptions = {
  title: "Testing!!!1",
  width: 720,
  height: 480,
  background: "#fff",
  fullscreen: false,
  left: undefined,
  top: undefined,
  visible: undefined,
  cursor: undefined,
  canvas: undefined,
  fit: undefined,
  page: undefined,
};
const window = new Window(windowConfig);


window.on("",(param)=>{

})