//@ts-check

import { App } from "./interface/App.js";
import { setDefautStyle, setup } from "./lib/base.js";

setDefautStyle({
  div: {
    padding: "4px",
    display: "flex",
    flexDirection: "row",
    gap: "4px",
    height: "fit-content",
    width: "fit-content",
  },
  button: {
    padding: "0 10px",
  },
});
setup(App());
