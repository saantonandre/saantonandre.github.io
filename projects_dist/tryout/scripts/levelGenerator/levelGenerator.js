class Cell {
  constructor(posX, posY, type, dir) {
    this.x = posX;
    this.y = posY;
    // Types: 0 - null, 1 - wall
    this.type = type || 0;
    this.dir = dir || 0;
  }
}
class LevelGenerator {
  constructor(links) {
    this.level = [];
    this.w = 11;
    this.h = 11;
    this.revealed = false;
    this.links = links || [];
  }
  generate(w, h, links) {
    if (w) {
      this.w = w;
    }
    if (h) {
      this.h = h;
    }
    if (links) {
      this.links = links;
    }
    // Fills the level with stuff
    this.level = [];
    for (let i = 0; i < this.w; i++) {
      this.level.push([]);
      for (let j = 0; j < this.h; j++) {
        Math.random() > 0.9
          ? this.level[i].push(new Cell(i, j, 1))
          : this.level[i].push(0);
      }
    }
    this.makeWalls();
    this.makeDoors();
    //this.consoleRender();
    return this.level;
  }
  makeWalls() {
    // up wall
    let y = 0;
    for (let i = 0; i < this.w; i++) {
      this.level[i].splice(y, 1, new Cell(i, y, 1));
    }
    // down wall
    y = this.h - 1;
    for (let i = 0; i < this.w; i++) {
      this.level[i].splice(y, 1, new Cell(i, y, 1));
    }
    // left wall
    let x = 0;
    for (let i = 0; i < this.h; i++) {
      this.level[x].splice(i, 1, new Cell(x, i, 1));
    }
    // right wall
    x = this.w - 1;
    for (let i = 0; i < this.h; i++) {
      this.level[x].splice(i, 1, new Cell(x, i, 1));
    }
  }
  makeDoors() {
    let halfW = (this.w / 2) | 0;
    let halfH = (this.h / 2) | 0;
    let hor = false;
    let x = 0;
    let y = 0;
    let doorType = 2;
    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i][0] == 0) {
        // Vertical
        hor = false;
        x = halfW;
        this.links[i][1] > 0 ? (y = this.h - 1) : (y = 0);
      } else {
        // Horizontal
        hor = true;
        y = halfH;
        this.links[i][0] > 0 ? (x = this.w - 1) : (x = 0);
      }

      this.level[x].splice(y, 1, new Cell(x, y, doorType, this.links[i]));
      hor ? y++ : x++;
      this.level[x].splice(y, 1, new Cell(x, y, doorType, this.links[i]));

      hor ? (y -= 2) : (x -= 2);
      if ((!hor && this.w % 2) || (hor && this.h % 2)) {
        this.level[x].splice(y, 1, new Cell(x, y, doorType, this.links[i]));
      }
    }
  }
  consoleRender() {
    let line = "";
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        line += this.level[j][i].type > 0 ? this.level[j][i].type : "-";
        line += " ";
      }
      line += "\n";
    }
    console.log(line);
  }
  render() {
    let size = 20;
    canvas.width = size * this.w;
    canvas.height = size * this.h;
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if (this.level[i][j] == 0) {
          continue;
        }
        // Draws rooms
        switch (this.level[i][j].type) {
          case 0:
            continue;
            break;
          case 1:
            c.fillStyle = "black";
            break;
          case 2:
            c.fillStyle = "blue";
            break;
          case 3:
            c.fillStyle = "red";
            break;
        }
        c.fillRect(
          i * size + size / 10,
          j * size + size / 10,
          size - size / 5,
          size - size / 5
        );
      }
    }
  }
}
