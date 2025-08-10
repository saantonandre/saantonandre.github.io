import config from "./config.js";
const spritesheet = (() => {
  const img = document.createElement("img");
  img.src = "./vendingMachine/vm-items.png";
  return img;
})();
await new Promise((resolve) => {
  spritesheet.onload = resolve;
});
export class Product {
  #spriteIndex = 0;
  #spritesheet = spritesheet;
  x = 0;
  y = 0;
  constructor(name = "Product name", price = 1, spriteIndex = 0) {
    this.name = name;
    this.price = price;
    this.#spriteIndex = spriteIndex;
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
      this.#spriteIndex * config.ITEM_WIDTH,
      0,
      config.ITEM_WIDTH,
      config.ITEM_HEIGHT,
      x,
      y,
      w,
      h
    );
  };
}
