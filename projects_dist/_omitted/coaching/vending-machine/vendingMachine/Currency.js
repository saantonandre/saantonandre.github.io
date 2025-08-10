import { coins } from "./coins.js";
const SIZE = 48;

const spritesheet = (() => {
  const img = document.createElement("img");
  img.src = "./vendingMachine/coins.png";
  return img;
})();
await new Promise((resolve) => {
  spritesheet.onload = resolve;
});
export class Currency {
  #spriteIndex = 0;
  #spritesheet = spritesheet;
  name = "coin";
  price = 0;
  x = 0;
  y = 0;
  constructor(currency) {
    this.#spriteIndex = coins.indexOf(currency);
    this.price = (Number(currency) / 100).toFixed(2);
  }
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  render = (context, x, y, w, h) => {
    context.drawImage(
      this.#spritesheet,
      this.#spriteIndex * SIZE,
      0,
      SIZE,
      SIZE,
      x,
      y,
      w,
      h
    );
  };
}
