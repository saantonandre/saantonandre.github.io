//@ts-check
import { Entity } from "./Entity.js";

const RESOURCE_BARS = 10;
const WIDTH = 40;
// const HEIGHT = 30;
export class Game {
  /** @param {HTMLElement} canvas  */
  constructor(canvas) {
    this.canvas = canvas;
  }
  /** Width (expressed in characters) */
  width = 60;
  player = new Entity("Player");
  enemy = new Entity();
  log = "";

  /** @type {()=>{v:string,p:"left"|"center"|"right"}[][]} */
  lines = () => [
    [{ v: `<a href="www.example.com">Laguna della morte</a>`, p: "left" }],
    [],
    [{ v: `[${this.log}]`, p: "center" }],
    [],
    [
      { v: `${this.player.name} LV ${this.player.lv}`, p: "left" },
      { v: `${this.enemy.name} LV ${this.enemy.lv}`, p: "right" },
    ],
    [
      {
        v: "_".repeat(`${this.player.name} LV ${this.player.lv}`.length),
        p: "left",
      },
      {
        v: "_".repeat(`${this.enemy.name} LV ${this.enemy.lv}`.length),
        p: "right",
      },
    ],
    [],
    [
      {
        v: `HP:[${"|"
          .repeat((this.player.hp / this.player.maxHp) * 10)
          .padEnd(RESOURCE_BARS, "-")}]`,
        p: "left",
      },
      {
        v: `HP:[${"|"
          .repeat((this.enemy.hp / this.enemy.maxHp) * 10)
          .padEnd(RESOURCE_BARS, "-")}]`,
        p: "right",
      },
    ],
    [
      {
        v: `${this.player.hp}/${this.player.maxHp}`,
        p: "left",
      },
      {
        v: `${this.enemy.hp}/${this.enemy.maxHp}`,
        p: "right",
      },
    ],
    [
      {
        v: `MP:[${"|"
          .repeat((this.player.mp / this.player.maxMp) * 10)
          .padEnd(RESOURCE_BARS, "-")}]`,
        p: "left",
      },
      {
        v: `MP:[${"|"
          .repeat((this.player.mp / this.player.maxMp) * 10)
          .padEnd(RESOURCE_BARS, "-")}]`,
        p: "right",
      },
    ],
    [
      {
        v: `${this.player.mp}/${this.player.maxMp}`,
        p: "left",
      },
      {
        v: `${this.enemy.mp}/${this.enemy.maxMp}`,
        p: "right",
      },
    ],
  ];
  async compute() {
    const input = await asyncInput();
    switch (input.key) {
      case "z": {
        this.player.attack(this.enemy);
        break;
      }
    }
    this.render();
    await this.computeCPU();
    this.render();
  }
  async computeCPU() {
    await new Promise((r) => setTimeout(r, 1000));
    this.enemy.attack(this.player);
    this.log = `A LV ${this.enemy.lv} ${this.enemy.name} appeared!`;
  }
  spawn() {
    this.enemy = new Entity("Minotaur");
    this.log = `A LV ${this.enemy.lv} ${this.enemy.name} appeared!`;
  }
  render() {
    let text = "";
    for (const line of this.lines()) {
      let lineArr = " ".repeat(this.width).split("");
      for (const element of line) {
        let start = 0;
        switch (element.p) {
          case "center":
            start = this.width / 2 - element.v.length / 2;
            break;
          case "right":
            start = this.width - element.v.length;
            break;
          case "left":
            start = 0;
            break;
          default:
            console.log("invalid positioning");
        }
        lineArr.splice(start, element.v.length, ...element.v);
      }
      text += lineArr.join("") + "\n";
    }
    this.canvas.innerHTML = text;
  }
}

/** @returns {Promise<KeyboardEvent>} */
function asyncInput() {
  return new Promise((resolve) => {
    document.addEventListener("keydown", resolve, { once: true });
  });
}
