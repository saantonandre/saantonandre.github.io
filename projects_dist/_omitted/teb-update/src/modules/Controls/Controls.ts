class ControlState {
  isNew = false;
  value = false;
}

/**
 * The Controls class initializes the input listeners and tracks values.
 *
 * Notable keys:
 * ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
 * w, a, s, d
 * ArrowUp, ArrowDown, ArrowLeft, ArrowRight
 * Control, Alt, Meta, Shift
 * 0 - 9
 * " " (blank space)
 * Enter, Escape, Backspace
 */
export abstract class Controls {
  private static initialized = false;
  /** Represents pressed keyboard keys */
  private static keys: Record<string | number, ControlState | undefined> = {};
  /** Represents mouse buttons */
  private static mouse: Record<string | number, ControlState | undefined> = {
    get left() {
      return this[0] || new ControlState();
    },
    set left(c: ControlState) {
      this[0] = c;
    },
    get middle() {
      return this[1] || new ControlState();
    },
    set middle(c: ControlState) {
      this[1] = c;
    },
    get right() {
      return this[2] || new ControlState();
    },
    set right(c: ControlState) {
      this[2] = c;
    },
  };
  static has(button: string | number) {
    return Boolean(this.keys[button]?.value || this.mouse[button]?.value);
  }
  static hasSome(buttons: (string | number)[]) {
    for (const button of buttons) {
      if (this.keys[button]?.value || this.mouse[button]?.value) return true;
    }
    return false;
  }
  static hasAll(buttons: (string | number)[]) {
    for (const button of buttons) {
      if (!(this.keys[button]?.value || this.mouse[button]?.value))
        return false;
    }
    return true;
  }
  static hasNew(button: string | number) {
    return Boolean(this.keys[button]?.isNew || this.mouse[button]?.isNew);
  }
  private static newKeys: ["mouse" | "keys", string | number, boolean][] = [];
  private static set(
    type: "mouse" | "keys",
    button: string | number,
    value: boolean
  ) {
    if (this[type][button]?.value === value) return;
    if (!this[type][button]) {
      this[type][button] = new ControlState();
    }
    this[type][button]!.value = value;
    this[type][button]!.isNew = value;
    if (value) this.newKeys.push([type, button, value]);
  }
  static initialize() {
    if (this.initialized) return;
    const mouseButtons = ["left", "middle", "right"];
    document.addEventListener("mousedown", (e) => {
      Controls.set("mouse", e.button, true);
    });
    document.addEventListener("mouseup", (e) => {
      Controls.set("mouse", e.button, false);
    });
    document.addEventListener("touchstart", () => {
      Controls.set("mouse", mouseButtons[0], true);
    });
    document.addEventListener("touchend", () => {
      Controls.set("mouse", mouseButtons[0], false);
    });
    document.addEventListener("keydown", (e) => {
      Controls.set("keys", e.key, true);
    });
    document.addEventListener("keyup", (e) => {
      Controls.set("keys", e.key, false);
    });
    this.initialized = true;
  }
  static resetNew() {
    for (const [type, button] of this.newKeys) {
      this[type][button]!.isNew = false;
    }
    this.newKeys.length = 0;
  }
}
Controls.initialize();
