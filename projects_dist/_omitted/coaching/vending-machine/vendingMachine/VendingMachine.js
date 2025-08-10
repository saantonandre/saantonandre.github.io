import { Product } from "./Product.js";
import config from "./config.js";
/** @typedef {undefined|[string,number,number]} ProductConfig */
export class VendingMachine {
  credit = 0;
  /** @type {Slot[][]} */
  slots = [];
  /** @type {ProductConfig} */
  products;
  /** @param {ProductConfig[]} products */
  constructor(products) {
    this.products = products;
    this.slots = this.#createtItemMatrix();
  }
  #createtItemMatrix = () => {
    const matrix = [];
    for (let h = 0; h < config.MATRIX_ROWS; h++) {
      const productsLine = [];
      for (let w = 0; w < config.MATRIX_COLS; w++) {
        const slot = new Slot("" + h + w);
        slot.stock = (Math.random() * 8) | 0;
        const randProduct =
          this.products[(Math.random() * this.products.length) | 0];
        if (randProduct) {
          slot.product = new Product(...randProduct);
        }
        productsLine.push(slot);
      }
      matrix.push(productsLine);
    }

    return matrix;
  };
  /**
   * @param {CanvasRenderingContext2D} context
   */
  renderItemMatrix = (context) => {
    for (let h = 0; h < this.slots.length; h++) {
      for (let w = 0; w < this.slots[h].length; w++) {
        const slot = this.slots[h][w];
        const spacingW = config.ITEM_WIDTH + 20;
        const spacingH = config.ITEM_HEIGHT + 40;
        if (slot.stock >= 1)
          slot.product?.render(
            context,
            w * spacingW,
            h * spacingH,
            config.ITEM_WIDTH,
            config.ITEM_HEIGHT
          );
        context.fillStyle = "white";
        context.font = "normal 24px monospace";
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText(
          slot.code,
          w * spacingW + w + config.ITEM_WIDTH / 2,
          h * spacingH + h + config.ITEM_HEIGHT + config.PADDING_X / 2
        );
        context.stroke();
      }
    }
  };
  /** @param {CanvasRenderingContext2D }context  */
  render = (context) => {
    this.renderItemMatrix(context);
  };
}

class Slot {
  code = "00";
  stock = 0;
  /** @type {Product|undefined} */
  product = undefined;
  constructor(code = "00") {
    this.code = code;
  }
}