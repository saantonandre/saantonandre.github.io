import { VendingMachine } from "./VendingMachine.js";
import { handleMessage, sendMessage } from "./messages.js";
import config from "./config.js";
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector(".canvas");
canvas.width = config.WIDTH;
canvas.height = config.HEIGHT;
const context = canvas.getContext("2d");

const products = [
  undefined,
  ["Lays", 125, 0],
  ["Doritos", 200, 1],
  ["7UP", 165, 2],
  ["Coca Cola", 150, 3],
  ["Kinder Bueno", 60, 4],
  ["Ritz", 180, 5],
  ["Fruity Snacks", 160, 6],
  ["Skittles", 110, 7],
];

const vendingMachine = new VendingMachine(products);

handleMessage("drop-item", (code) => {
  const item = vendingMachine.slots[code[0]][code[1]];
  if (item.stock < 1) {
    throw new Error("NO STOCK");
  }
  item.stock -= 1;
  const params = products.find((product) => {
    return product && product[0] === item.product.name;
  });
  render();
  sendMessage("item-drop", ...params);
});

/** @param {CanvasRenderingContext2D} context */
export const clear = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const render = () => {
  clear();
  vendingMachine.renderItemMatrix(context);
};

const initialize = async () => {
  render();
};
initialize();

/** @type {HTMLDivElement} */
const display = document.querySelector(".display");
handleMessage("print", (text) => {
  display.value = text;
});

handleMessage("get-item-details", (code) => {
  const item = vendingMachine.slots[code[0]][code[1]];
  const details = {
    name: item.product.name,
    price: item.product.price,
    stock: item.stock,
  };
  console.log(details)
  sendMessage("item-details", details);
});
