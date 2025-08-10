// TETROMINOS
class Tetromino {
  constructor() {
    this.initialX = 5;
    this.initialY = 0;
    this.x = this.initialX;
    this.y = this.initialY;
    this.shape;
    this.formation = [];
    this.rot = 0;
    this.shapes = ["I", "O", "Z", "ZR", "L", "LR", "T"];

    let shapeO = [
      [
        [1, 1],
        [1, 1],
      ],
    ];

    let shapeI = [[[2], [2], [2], [2]], [[2, 2, 2, 2]]];

    let shapeL = [
      [[3], [3], [3, 3]],
      [[3, 3, 3], [3]],
      [
        [3, 3],
        [0, 3],
        [0, 3],
      ],
      [
        [0, 0, 3],
        [3, 3, 3],
      ],
    ];

    let shapeLR = [
      [
        [0, 4],
        [0, 4],
        [4, 4],
      ],
      [[4], [4, 4, 4]],
      [[4, 4], [4], [4]],
      [
        [4, 4, 4],
        [0, 0, 4],
      ],
    ];

    let shapeZ = [
      [
        [5, 5],
        [0, 5, 5],
      ],
      [[0, 5], [5, 5], [5]],
    ];

    let shapeZR = [
      [
        [0, 6, 6],
        [6, 6],
      ],
      [[6], [6, 6], [0, 6]],
    ];

    let shapeT = [
      [
        [7, 7, 7],
        [0, 7],
      ],
      [
        [0, 7],
        [7, 7],
        [0, 7],
      ],
      [
        [0, 7],
        [7, 7, 7],
      ],
      [[7], [7, 7], [7]],
    ];

    this.shapes = [];
    this.shapes.push(shapeT);
    this.shapes.push(shapeI);
    this.shapes.push(shapeO);
    this.shapes.push(shapeZ);
    this.shapes.push(shapeZR);
    this.shapes.push(shapeL);
    this.shapes.push(shapeLR);
    this.nextShape();
  }
  nextShape() {
    this.shape = this.shapes[(Math.random() * 7) | 0];
    this.rot = 0;
    this.updateFormation();
  }
  updateFormation() {
    this.formation = this.shape[this.rot].slice();
  }
}

class Tetris {
  constructor() {
    this.cellSize = 25;
    this.cellsValue = 2;
    this.speed = 1;
    this.cells = [];
    this.tetromino = new Tetromino();
    /* Colors
      O = yellow
      I = cyan
      L = orange
      Lr= blue
      Z = red
      Zr = green
      T = purple
    */
    this.colors = [
      "yellow",
      "cyan",
      "orange",
      "blue",
      "red",
      "green",
      "purple",
    ];
    this.w = 12;
    this.h = 22;
    this.score = 0;
    this.ticks = 30;
    this.counter = 0;
    this.cols = {
      L: 0,
      R: 0,
      T: 0,
      B: 0,
    };
    document.addEventListener("keyup", function (evt) {
      let key = evt.which;
      switch (key) {
        case 37: // Move left
          tetris.moveLeft();
          break;
        case 38: //
          tetris.rotate();
          break;
        case 39: // Move right
          tetris.moveRight();
          break;
        case 40: //down
          tetris.hardDrop();
          break;
      }
    });
    this.initBoard();
    this.pushAtPos(this.tetromino.x, this.tetromino.y);
  }
  initBoard() {
    this.cells = [];
    for (let i = 0; i < this.w; i++) {
      this.cells.push([]);
      for (let j = 0; j < this.h; j++) {
        this.cells[i].push(0);
      }
    }
  }
  pushAtPos(x, y) {
    for (let i = 0; i < this.tetromino.formation.length; i++) {
      for (let j = 0; j < this.tetromino.formation[i].length; j++) {
        if (this.tetromino.formation[i][j] == 0) {
          continue;
        }
        this.cells[x + j][y + i] = this.tetromino.formation[i][j];
      }
    }
  }
  clearAtPos(x, y) {
    for (let i = 0; i < this.tetromino.formation.length; i++) {
      for (let j = 0; j < this.tetromino.formation[i].length; j++) {
        if (this.tetromino.formation[i][j]) {
          this.cells[x + j][y + i] = 0;
        }
      }
    }
  }
  hardDrop() {
    while (!this.cols.B) {
      this.compute();
    }
  }
  checkCols() {
    // Clears to avoid self-collisions
    this.clearAtPos(this.tetromino.x, this.tetromino.y);

    let t = this.tetromino.formation;
    let x = this.tetromino.x;
    let y = this.tetromino.y;
    this.cols.L = 0;
    this.cols.R = 0;
    this.cols.T = 0;
    this.cols.B = 0;

    for (let i = 0; i < t.length; i++) {
      for (let j = 0; j < t[i].length; j++) {
        if (t[i][j] == 0) {
          continue;
        }
        if (j + x - 1 < 0) {
          this.cols.L = 1;
        } else if (this.cells[j + x - 1][i + y]) {
          // Left col
          this.cols.L = 1;
        }

        if (j + x + 1 >= this.w) {
          this.cols.R = 1;
        } else if (this.cells[j + x + 1][i + y]) {
          // Right col
          this.cols.R = 1;
        }

        if (i + y - 1 < 0) {
          this.cols.T = 1;
        } else if (this.cells[j + x][i + y - 1]) {
          // Up col
          this.cols.T = 1;
        }

        if (i + y + 1 >= this.h) {
          this.cols.B = 1;
        } else if (this.cells[j + x][i + y + 1]) {
          // Down col
          this.cols.B = 1;
        }
      }
    }
    // Places again the piece
    this.pushAtPos(this.tetromino.x, this.tetromino.y);
  }
  canRotate() {
    // Clears to avoid self-collisions
    this.clearAtPos(this.tetromino.x, this.tetromino.y);
    let rot = this.tetromino.rot + 1;
    if (rot >= this.tetromino.shape.length) {
      rot = 0;
    }
    let t = this.tetromino.shape[rot];
    let x = this.tetromino.x;
    let y = this.tetromino.y;
    for (let i = 0; i < t.length; i++) {
      for (let j = 0; j < t[i].length; j++) {
        if (t[i][j] == 0) {
          continue;
        }
        if (i + y < 0 || i + y >= this.h || j + x < 0 || j + x >= this.w) {
          // Places again the piece
          this.pushAtPos(this.tetromino.x, this.tetromino.y);
          return false;
        } else if (this.cells[j + x][i + y]) {
          // Places again the piece
          this.pushAtPos(this.tetromino.x, this.tetromino.y);
          return false;
        }
      }
    }
    // Places again the piece
    this.pushAtPos(this.tetromino.x, this.tetromino.y);
    return true;
  }
  moveLeft() {
    if (this.cols.L) {
      return;
    }
    this.clearAtPos(this.tetromino.x, this.tetromino.y);
    this.tetromino.x--;
    this.pushAtPos(this.tetromino.x, this.tetromino.y);
    this.checkCols();
  }
  moveRight() {
    if (this.cols.R) {
      return;
    }
    this.clearAtPos(this.tetromino.x, this.tetromino.y);
    this.tetromino.x++;
    this.pushAtPos(this.tetromino.x, this.tetromino.y);
    this.checkCols();
  }
  rotate() {
    if (!this.canRotate()) {
      return;
    }
    this.clearAtPos(this.tetromino.x, this.tetromino.y);
    this.tetromino.rot++;
    if (this.tetromino.rot > this.tetromino.shape.length - 1) {
      this.tetromino.rot = 0;
    }
    this.tetromino.updateFormation();
    this.pushAtPos(this.tetromino.x, this.tetromino.y);
    this.checkCols();
  }
  checkLines() {
    for (let i = 0; i < this.h; i++) {
      let lined = true;
      for (let j = 0; j < this.w; j++) {
        if (this.cells[j][i] == 0) {
          lined = false;
        }
      }
      if (lined) {
        for (let j = 0; j < this.w; j++) {
          this.cells[j].splice(i, 1);
          this.cells[j].splice(0, 0, 0);
        }
        this.checkLines();
        return;
      }
    }
  }
  compute() {
    if (this.cols.B) {
      this.tetromino.x = this.tetromino.initialX;
      this.tetromino.y = this.tetromino.initialY;
      this.tetromino.nextShape();
      this.pushAtPos(this.tetromino.x, this.tetromino.y);
      this.checkCols();
      this.checkLines();
    } else {
      this.clearAtPos(this.tetromino.x, this.tetromino.y);
      this.tetromino.y++;
      this.pushAtPos(this.tetromino.x, this.tetromino.y);
      this.checkCols();
      this.checkLines();
    }
  }
  render() {
    this.counter++;
    if (this.counter >= this.ticks) {
      this.counter = 0;
      this.compute();
    }
    c.fillStyle = "black";
    c.fillRect(
      0,
      0,
      this.w*this.cellSize,
      this.h*this.cellSize
    )
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if (this.cells[i][j] != 0) {
          c.fillStyle = this.colors[this.cells[i][j] - 1];
          c.fillRect(
            i * this.cellSize,
            j * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
        c.strokeStyle = "black";
        c.beginPath();
        c.rect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        c.closePath();
        c.stroke();
      }
    }
  }
}
