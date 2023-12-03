// TWENTY 48
/*
move non-0 cells ->
if none cant be moved -> return
if it collides with same number, merge
if collided with different number or wall, stop
then spawn a 2 in a random void cell
*/
class CellTF {
  constructor(value) {
    this.value = value;
    this.merged = false;
    this.score = 0;
  }
}
class Twenty48 {
  constructor() {
    this.cellSize = 80;
    this.cellsValue = 2;
    this.cells = [];
    this.w = 4;
    this.h = 4;
    this.mergedList = [];
    this.movedSuccesfully = false;
    this.mergingHappened = false;
    this.score = 0;
    document.addEventListener("keyup", function (evt) {
      let key = evt.which;
      switch (key) {
        case 37: //left
          twenty48.moveTable("left");
          break;
        case 38: //up
          twenty48.moveTable("up");
          break;
        case 39: //right
          twenty48.moveTable("right");
          break;
        case 40: //down
          twenty48.moveTable("down");
          break;
      }
    });
    this.initBoard();
  }
  initBoard() {
    this.cells = [[], [], [], []];
    for (let i = 0; i < this.w; i++) {
      this.cells.push([]);
      for (let j = 0; j < this.h; j++) {
        this.cells[i].push(new CellTF(0));
      }
    }
    this.addNumber();
    this.addNumber();
  }
  addNumber() {
    let voidCells = [];
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if (this.cells[i][j].value == 0) {
          voidCells.push([i, j]);
        }
      }
    }
    if (!voidCells.length) {
      return;
    }
    let randomVoid = voidCells[(Math.random() * voidCells.length) | 0];
    this.cells[randomVoid[0]][randomVoid[1]].value = this.cellsValue;
  }
  resetMerged() {
    // Sets to false all the merged properties
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        this.cells[i][j].merged = false;
      }
    }
  }
  moveTable(dir) {
    this.mergedList = [];
    switch (dir) {
      case "left":
        for (let i = 0; i < this.w; i++) {
          for (let j = 0; j < this.h; j++) {
            if (this.cells[i][j].value != 0) {
              this.moveCell(i, j, dir);
            }
          }
        }
        break;
      case "right":
        for (let i = this.w - 1; i > -1; i--) {
          for (let j = 0; j < this.h; j++) {
            if (this.cells[i][j].value != 0) {
              this.moveCell(i, j, dir);
            }
          }
        }
        break;
      case "down":
        for (let i = 0; i < this.w; i++) {
          for (let j = this.h - 1; j > -1; j--) {
            if (this.cells[i][j].value != 0) {
              this.moveCell(i, j, dir);
            }
          }
        }
        break;
      case "up":
        for (let i = 0; i < this.w; i++) {
          for (let j = 0; j < this.h; j++) {
            if (this.cells[i][j].value != 0) {
              this.moveCell(i, j, dir);
            }
          }
        }
        break;
    }
    if (this.movedSuccesfully) {
      this.addNumber();
      this.resetMerged();
      this.movedSuccesfully = false;
    }
  }
  moveCell(x, y, dir) {
    if (this.cells[x][y].value == 0) {
      return;
    }
    let adjacent = [x, y];
    switch (dir) {
      case "left":
        adjacent[0]--;
        break;
      case "up":
        adjacent[1]--;
        break;
      case "right":
        adjacent[0]++;
        break;
      case "down":
        adjacent[1]++;
        break;
    }
    // If it's out of bound or of a different number -> stop moving
    if (
      adjacent[0] < 0 ||
      adjacent[1] < 0 ||
      adjacent[0] >= this.w ||
      adjacent[1] >= this.h
    ) {
      return;
    }

    // If it's empty(value of 0) -> move
    if (this.cells[adjacent[0]][adjacent[1]].value == 0) {
      this.cells[adjacent[0]][adjacent[1]].value = this.cells[x][y].value;
      this.cells[adjacent[0]][adjacent[1]].merged = this.cells[x][y].merged;
      this.cells[x][y].value = 0;
      this.cells[x][y].merged = 0;
      this.moveCell(adjacent[0], adjacent[1], dir);
      this.movedSuccesfully = true;
      return;
    }
    // If it's of the same amount -> merge
    if (this.cells[adjacent[0]][adjacent[1]].value == this.cells[x][y].value) {
      // Merge only once
      if (
        this.cells[adjacent[0]][adjacent[1]].merged ||
        this.cells[x][y].merged
      ) {
        return;
      }
      // Add the amounts to the recipient and set original to value 0
      this.score += this.cells[x][y].value;
      this.cells[adjacent[0]][adjacent[1]].value += this.cells[x][y].value;
      this.cells[adjacent[0]][adjacent[1]].merged = true;

      this.cells[x][y].value = 0;

      this.movedSuccesfully = true;
    }
  }
  compute() {}
  render() {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        c.fillStyle = "white";
        c.fillRect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        c.fillStyle = "black";
        let digits = "" + this.cells[i][j].value;
        let digitCount = digits.length;
        c.font = this.cellSize / digitCount + "px serif";
        c.textBaseline = "middle";
        c.textAlign = "center";
        if (this.cells[i][j].value !== 0) {
          c.fillText(
            this.cells[i][j].value,
            i * this.cellSize + this.cellSize * 0.5,
            j * this.cellSize + this.cellSize * 0.55
          );
        }
        c.beginPath();
        c.rect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        c.closePath();
        c.strokeStyle = "gray";
        c.stroke();
      }
    }
    this.renderScore();
  }
  renderScore() {
    let x = 0;
    let y = this.h * this.cellSize;
    let w = this.w * this.cellSize;
    let h = this.cellSize / 2;
    c.fillStyle = "black";
    c.strokeStyle = "black";
    c.beginPath();
    c.rect(x, y, w, h);
    c.closePath();
    c.stroke();
    c.font = this.cellSize / 2 + "px serif";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.fillText("SCORE: " + this.score, x + w / 2, y + h / 2);
  }
}
