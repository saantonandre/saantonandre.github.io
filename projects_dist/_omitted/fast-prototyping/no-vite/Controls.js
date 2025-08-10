export class Controls {
  static keys={};
  static has(key) {
    return Controls.keys[key] || false;
  }
}

addEventListener("keydown", (e) => (Controls.keys[e.key] = true));
addEventListener("keyup", (e) => (Controls.keys[e.key] = false));
