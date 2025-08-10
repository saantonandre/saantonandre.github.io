import { Sprite } from "../interfaces/Sprite";

export class TextSpritesheet implements Sprite {
  private symbols = [" ", "▀", "▄", "█"];
  bin: number[] = [];
  text;
  width;
  constructor(values: Uint8ClampedArray, width: number) {
    this.bin = this.pixelsToBin(values);
    this.width = width;
    this.text = this.binToText(this.pixelsToBin(values), this.width);
  }
  getSprite(x: number, y: number, w: number, h: number): Sprite {
    const sprite: number[] = [];
    for (let i = 0; i < w * h; i++) {
      const sx = i % w;
      const sy = Math.floor(i / w);
      const index = (y + sy) * this.width + x + sx;
      sprite.push(this.bin[index]);
    }
    return { text: this.binToText(sprite, w), width: w };
  }
  pixelsToBin(values: Uint8ClampedArray) {
    const array = [];
    for (let i = 0; i < values.length; i += 4) {
      const hasPixel = values[i + 3] > 0;
      array.push(hasPixel ? 1 : 0);
    }
    return array;
  }
  binToText(values: number[], width: number) {
    let newContent = [];
    for (let i = 0; i < values.length; i++) {
      const charCode = values[i];
      const charCode2 = (values[i + width] || 0) * 2;
      newContent.push(charCode + charCode2);
      if (i !== 0 && (i + 1) % width === 0) {
        i += width;
      }
    }
    let text = "";
    for (let i = 0; i < newContent.length; i++) {
      text += this.symbols[newContent[i]];
    }
    return text;
  }
}
