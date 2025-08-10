export class Controls {
  private static keys: Record<string, boolean> = {};
  static has(key: string) {
    return Controls.keys[key] || false;
  }
}
