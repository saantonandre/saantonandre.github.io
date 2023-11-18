// MINE SWEEPER

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    //states:
    //"b" = has a bomb
    // n = nearby bombs
    this.state = 0;
    this.revealed = false;
  }
}
class MineSweeper {
  constructor(x, y, w, h) {
    this.cellSize = 30;
    this.cells = [];
    this.w = 20;
    this.h = 20;
    this.mines = 50;
    canvas.addEventListener("click", function (evt) {
      let x = ((evt.clientX - canvas.offsetLeft) / mineSweeper.cellSize) | 0;
      let y = ((evt.clientY - canvas.offsetTop) / mineSweeper.cellSize) | 0;
      mineSweeper.propagateReveal(x, y);
      //console.log(evt.clientX,evt.clientY)
    });
    canvas.addEventListener("contextmenu", function (evt) {
      evt.preventDefault();
      let x = ((evt.clientX - canvas.offsetLeft) / mineSweeper.cellSize) | 0;
      let y = ((evt.clientY - canvas.offsetTop) / mineSweeper.cellSize) | 0;
      mineSweeper.flag(x, y);
      //console.log(evt.clientX,evt.clientY)
    });
    this.initBoard();
  }
  initBoard() {
    for (let i = 0; i < this.w; i++) {
      this.cells.push([]);
    }
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        this.cells[i][j] = new Cell(i, j);
      }
    }
    this.placeBombs();
    this.placeNumbers();
  }
  placeBombs() {
    let combo = [];
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        combo.push([i, j]);
      }
    }
    for (let i = 0; i < this.mines; i++) {
      let randPos = combo.splice((Math.random() * combo.length) | 0, 1)[0];
      this.cells[randPos[0]][randPos[1]].state = "b";
    }
  }
  placeNumbers() {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if (this.cells[i][j].state !== "b") {
          this.cells[i][j].state = this.checkNearbyBombs(i, j);
        }
      }
    }
  }
  checkNearbyBombs(i, j) {
    let n = 0;

    let canLeft = i - 1 < 0 ? false : true;
    let canUp = j - 1 < 0 ? false : true;
    let canRight = i + 1 >= this.w ? false : true;
    let canDown = j + 1 >= this.h ? false : true;
    if (canLeft) {
      if (canUp) {
        this.cells[i - 1][j - 1].state == "b" ? n++ : 0;
      }
      this.cells[i - 1][j].state == "b" ? n++ : 0;
      if (canDown) {
        this.cells[i - 1][j + 1].state == "b" ? n++ : 0;
      }
    }

    if (canUp) {
      this.cells[i][j - 1].state == "b" ? n++ : 0;
    }
    if (canDown) {
      this.cells[i][j + 1].state == "b" ? n++ : 0;
    }

    if (canRight) {
      if (canUp) {
        this.cells[i + 1][j - 1].state == "b" ? n++ : 0;
      }
      this.cells[i + 1][j].state == "b" ? n++ : 0;
      if (canDown) {
        this.cells[i + 1][j + 1].state == "b" ? n++ : 0;
      }
    }

    return n;
  }
  revealNearby(i, j) {
    let canLeft = i - 1 < 0 ? false : true;
    let canUp = j - 1 < 0 ? false : true;
    let canRight = i + 1 >= this.w ? false : true;
    let canDown = j + 1 >= this.h ? false : true;
    if (canLeft) {
      if (canUp) {
        this.propagateReveal(i - 1, j - 1);
      }
      this.propagateReveal(i - 1, j);
      if (canDown) {
        this.propagateReveal(i - 1, j + 1);
      }
    }

    if (canUp) {
      this.propagateReveal(i, j - 1);
    }
    if (canDown) {
      this.propagateReveal(i, j + 1);
    }

    if (canRight) {
      if (canUp) {
        this.propagateReveal(i + 1, j - 1);
      }
      this.propagateReveal(i + 1, j);
      if (canDown) {
        this.propagateReveal(i + 1, j + 1);
      }
    }
  }
  propagateReveal(x, y) {
    if (this.cells[x][y].revealed || this.cells[x][y].flagged) {
      return;
    }
    if (this.cells[x][y].state == "b") {
      this.initBoard();
      return;
    }
    this.cells[x][y].revealed = true;
    if (this.cells[x][y].state == 0) {
      this.revealNearby(x, y);
    }
  }
  flag(x, y) {
    if (this.cells[x][y].revealed) {
      return;
    }
    if (this.cells[x][y].flagged) {
      this.cells[x][y].flagged = false;
    } else {
      this.cells[x][y].flagged = true;
    }
  }
  compute() {}
  render() {
    c.textBaseline = "middle";
    c.textAlign = "center";
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        c.fillStyle = "black";
        if (this.cells[i][j].revealed) {
          c.fillStyle = "white";
        }
        if (this.cells[i][j].flagged) {
          c.fillStyle = "red";
        }
        c.fillRect(
          this.cells[i][j].x * this.cellSize,
          this.cells[i][j].y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        c.beginPath();
        c.rect(
          this.cells[i][j].x * this.cellSize,
          this.cells[i][j].y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        c.closePath();
        c.strokeStyle = "gray";
        c.stroke();
        if (this.cells[i][j].revealed && this.cells[i][j].state) {
          c.fillStyle = "red";
          c.font = this.cellSize + "px serif";
          c.fillText(
            this.cells[i][j].state,
            this.cells[i][j].x * this.cellSize + this.cellSize/2,
            this.cells[i][j].y * this.cellSize + this.cellSize/2
          );
        }
        c.fillStyle = "black";
      }
    }
  }
}
