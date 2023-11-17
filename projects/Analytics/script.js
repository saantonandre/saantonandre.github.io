/** saantonandre - The following code has been refactored on 2023-10-27 */

/**
 * @typedef {{
 *          x: number,
 *          y: number,
 *          lvl: number,
 *      }[]} Deaths
 * @typedef {Record<string,{
 *      deaths: Deaths,
 *      date: string,
 *      deathsN: number,
 *      retention: number,
 *      level: number,
 * }>} Sessions
 *
 *  @typedef {[number,number]} Tile
 *  @typedef {{
 *      x: number,
 *      y: number,
 *      w: number,
 *      h: number,
 *      type: number
 * }} MapTile
 *  @typedef {MapTile[]} GameMap
 */
class State {
  constructor() {
    this.level = 0;
    this.session = "0";
    this.basesize = 16;
    this.tilesize = 16;
    /** @type {HTMLButtonElement[]} */
    this.lvlButtons = [];
    /** @type {HTMLButtonElement[]} */
    this.playButtons = [];
    /** @type {Tile[]} */
    this.tiles = [];
    /** @type {Sessions} */
    this.sessions = {};
    /** @type {GameMap[]} */
    this.maps = [];
    this.miscData = {
      maxDeaths: 0,
      maxSumDeaths: 0,
      levelsMaxDeaths: [0],
    };
    /**
     * @typedef {Record<string,number[]>} DeathsMap
     * @type {DeathsMap}
     */
    this.deathsMap = {};
    this.body = document.querySelector("body");
    this.canvas = document.createElement("canvas");
    this.c = this.canvas.getContext("2d");
    this.init();
  }
  init = async () => {
    document.getElementById("canvas-cont").appendChild(this.canvas);
    this.tiles = await fetch("./tiles.json").then((data) => data.json());
    this.sessions = await fetch("./sessions.json").then((data) => data.json());
    this.maps = await fetch("./maps.json")
      .then((data) => data.json())
      .then((res) =>
        res.map((gameMap) => gameMap.sort((a, b) => (b.type > a.type ? 1 : -1)))
      );
    this.miscData = {
      maxDeaths: 0,
      maxSumDeaths: 0,
      levelsMaxDeaths: new Array(this.maps.length).fill(0),
    };
    this.deathsMap = Object.entries(this.sessions).reduce(
      (prev, [user, record]) => {
        /** @type {number[]} */
        const deathArray = new Array(this.maps.length).fill(0);
        const maxDeaths = Math.max(...deathArray);
        record.deaths?.forEach(({ lvl }) => deathArray[lvl]++);
        deathArray.forEach((n, i) => {
          if (n > this.miscData.levelsMaxDeaths[i]) {
            this.miscData.levelsMaxDeaths[i] = n;
          }
        });
        if (maxDeaths > this.miscData.maxDeaths) {
          this.miscData.maxDeaths = maxDeaths;
        }
        const sumDeaths = deathArray.reduce((a, b) => a + b, 0);
        if (sumDeaths > this.miscData.maxSumDeaths) {
          this.miscData.maxSumDeaths = sumDeaths;
        }
        return { ...prev, [user]: deathArray };
      },
      {}
    );
    this.lvlButtons = levelButtons(this.miscData.levelsMaxDeaths, (level) =>
      this.setParams({ l: level })
    );
    let lvlCont = document.getElementById("levels-cont");
    this.lvlButtons.forEach((b) => lvlCont.appendChild(b));

    this.playButtons = playerButtons(this.sessions, (player) =>
      this.setParams({ s: player })
    );
    let playersCont = document.getElementById("players-cont");
    this.playButtons.forEach((b) => playersCont.appendChild(b));

    this.setParams({ l: 0, s: Object.keys(this.sessions)[0] });
  };
  render = () => {
    resizeCanvas(this.canvas, this.maps[this.level], this.tilesize);
    drawMap(
      this.canvas,
      this.c,
      this.maps[this.level],
      this.tiles,
      this.tilesize,
      this.basesize
    );
    drawDeaths(
      this.c,
      this.sessions[this.session].deaths,
      this.tilesize,
      this.level
    );
    this.colorLvlButtons();
    this.colorPlayButtons();
  };
  setParams = (params = { l: this.level, s: this.session }) => {
    console.log(params);
    this.level = params.l !== undefined ? params.l : this.level;
    this.session = params.s !== undefined ? params.s : this.session;
    this.render();
  };
  colorPlayButtons = () => {
    const max = Math.max(...Object.values(this.sessions).map((v) => v.deathsN));
    this.playButtons.forEach((button, i) => {
      const deaths = this.sessions[button.id].deathsN;
      const deathsHex = Math.round((deaths / max) * 255)
        .toString(16)
        .padStart(2, "0");
        console.log({deathsHex})
      button.style.backgroundColor = `#ff0000${deathsHex}`;
    });
  };
  colorLvlButtons = () => {
    const deaths = this.deathsMap[this.session];
    const max = Math.max(...deaths);
    this.lvlButtons.forEach((button, i) => {
      const deathsHex = Math.round((deaths[i] / max) * 255)
        .toString(16)
        .padStart(2, "0");
      button.style.backgroundColor = `#ff0000${deathsHex}`;
    });
  };
}
window.onload = () => {
  new State();
};
/**
 * @param {HTMLCanvasElement} canvas
 * @param {GameMap} map
 * @param {number} tilesize
 *
 */
const resizeCanvas = (canvas, map, tilesize) => {
  const { w, h } = map.reduce(
    (prev, tile) => {
      if (tile.x + tile.w > prev.w) {
        prev.w = tile.x + tile.w;
      }
      if (tile.y + tile.h > prev.h) {
        prev.h = tile.y + tile.h;
      }
      return prev;
    },
    { w: 0, h: 0 }
  );
  canvas.width = w * tilesize;
  canvas.height = h * tilesize;
  console.log(`Resizing ${w * tilesize} ${h * tilesize}`);
};
/**
 * @param {number[]} maxDeathsArr
 * @param {function} callback
 * @returns
 */
const levelButtons = (maxDeathsArr, callback) => {
  /** @type {HTMLButtonElement[]} */
  const buttons = [];
  for (let i = 0; i < maxDeathsArr.length; i++) {
    let btn = document.createElement("BUTTON");
    btn.innerText = i;
    btn.title = `Level ${i}`;
    buttons.push(btn);
  }
  buttons.forEach((btn, i) => {
    btn.onclick = () => {
      buttons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      callback(i);
    };
  });
  return buttons;
};
/**
 * @param {Sessions} sessions
 * @param {function} callback
 * @returns
 */
const playerButtons = (sessions, callback) => {
  /** @type {HTMLButtonElement[]} */
  const buttons = [];
  let i = 0;
  for (const player in sessions) {
    let btn = document.createElement("BUTTON");
    btn.innerText = i;
    btn.id = player;
    btn.title = `Player ${i}`;
    buttons.push(btn);
    i++;
  }
  buttons.forEach((btn) => {
    btn.onclick = () => {
      buttons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      callback(btn.id);
    };
  });
  return buttons;
};
/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} c
 * @param {GameMap} gameMap
 * @param {Tile[]} tiles
 * @param {number} tilesize
 * @param {number} baseSize
 */
const drawMap = (canvas, c, gameMap, tiles, tilesize, baseSize) => {
  const sheet = document.getElementById("sheet");
  c.clearRect(0, 0, canvas.width, canvas.height);
  gameMap.forEach((tile) => {
    for (let j = 0; j < tile.h; j++) {
      for (let k = 0; k < tile.w; k++) {
        c.drawImage(
          sheet,
          tiles[tile.type][0] * baseSize,
          tiles[tile.type][1] * baseSize,
          baseSize,
          baseSize,
          (tile.x + k) * tilesize,
          (tile.y + j) * tilesize,
          tilesize,
          tilesize
        );
      }
    }
  });
};
/**
 * @param {CanvasRenderingContext2D} c
 * @param {Deaths} deaths
 * @param {number} tilesize
 * @param {number} level
 */
const drawDeaths = (c, deaths, tilesize, level) => {
  deaths
    .filter((d) => d.lvl === level)
    .forEach(({ x, y }) => {
      c.beginPath();
      c.arc(x * tilesize, y * tilesize, tilesize * 1.5, 0, 2 * Math.PI);
      c.lineWidth = 3;
      c.strokeStyle = "#FF0000";
      c.stroke();
    });
};
