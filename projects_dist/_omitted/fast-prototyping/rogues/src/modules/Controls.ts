export class Controls {
  constructor() {
    throw "This class can't be istantiated";
  }
  /** Keyboard keys */
  static keys: Record<string, boolean> = {};
  /** Mouse buttons */
  static buttons: Record<string, boolean> = {};
  static has(key: string) {
    return Controls.keys[key] || Controls.buttons[key] || false;
  }
}

addEventListener("keydown", (e) => {
  Controls.keys[e.key] = true;
});
addEventListener("keyup", (e) => {
  Controls.keys[e.key] = false;
});

addEventListener("mousedown", (e) => {
  console.log(e.button)
  Controls.buttons[e.button] = true;
});
addEventListener("mouseup", (e) => {
  e.button;
  Controls.buttons[e.button] = false;
});
