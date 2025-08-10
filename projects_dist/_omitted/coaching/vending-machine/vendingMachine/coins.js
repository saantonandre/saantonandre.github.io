import * as msg from "./messages.js"

const spritesheet = (() => {
  const img = document.createElement("img");
  img.src = "./vendingMachine/coins.png";
  return img;
})();
await new Promise((resolve) => {
  spritesheet.onload = resolve;
});

const SIZE = 48;

export const coins = [1, 2, 5, 10, 20, 50, 100, 200];
const container = document.querySelector(".coins-container");
const coinButtons = coins.map((value, i) => {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const button = document.createElement("button");
  const context = canvas.getContext("2d");
  context.drawImage(spritesheet, SIZE * i, 0, SIZE, SIZE, 0, 0, SIZE, SIZE);
  button.appendChild(canvas);
  button.onclick=()=>{
    msg.sendMessage("coin-inserted",value)
    msg.sendMessage("audio","coin-insert")
  }
  return button;
});
container.append(...coinButtons)