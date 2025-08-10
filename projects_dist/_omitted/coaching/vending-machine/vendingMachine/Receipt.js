const spritesheet = (() => {
  const img = document.createElement("img");
  img.src = "./vendingMachine/receipt.png";
  return img;
})();
await new Promise((resolve) => {
  spritesheet.onload = resolve;
});
export class Receipt {
  #spritesheet = spritesheet;
  name = "receipt";
  price = 0;
  x = 0;
  y = 0;
  timestamp=new Date().toLocaleString()
  constructor(refundAmount) {
    this.price = (Number(refundAmount) / 100).toFixed(2);
  }
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  onClick = () => {
    alert(`
---- VENDING MACHINE 3000 ----

Amount due: ${this.price}
Emission date: ${this.timestamp}

Thanks for your purchase!
To get your refund, show this receipt at our store during working hours.
`);
  };
  render = (context, x, y, w, h) => {
    context.drawImage(this.#spritesheet, x, y, w, h);
  };
}
