export class StarsService {
  constructor(canvas) {
    this.stars = [];
    this.MAX_STARS = 500;
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.starsAmount =
      (((this.canvas.width * this.canvas.height) / 800) | 0) < this.MAX_STARS
        ? ((this.canvas.width * this.canvas.height) / 800) | 0
        : this.MAX_STARS;

    this.ratio = 1;
    this.deltaTime = 1;
    this.timestamp = Date.now();
    this.lastTimestamp = 0;
    this.perfectFrameTime = 1000 / 60;
    this.fps = 0;
    this.fpsCounter = 0;
    this.mouse={
      x: -1000,
      y: -1000
    }
    this.c = canvas.getContext("2d");

    // Binding the functions to THIS
    this.updateFps = this.updateFps.bind(this);
    this.updateDeltaTime = this.updateDeltaTime.bind(this);
    this.init = this.init.bind(this);
    this.loop = this.loop.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.boost = this.boost.bind(this);
    // Readjusts the stars on resize
    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("click", this.boost);
  }
  returnCanvas=()=>{
      return this.canvas;
  }
  boost() {
    for (let item of this.stars) {
      item.xVelExt = (Math.random() - 0.5) * item.speed * 15;
      item.yVelExt = (Math.random() - 0.5) * item.speed * 15;
    }
  }
  resizeHandler() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.stars.length = 0;
    this.populate();
  }
  updateDeltaTime() {
    this.lastTimestamp = this.timestamp;
    this.timestamp = Date.now();
    this.deltaTime =
      (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;
  }
  updateFps() {
    this.fps = this.fpsCounter;
    this.fpsCounter = 0;
  }
  updateMousePos=(e) =>{
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }
  populate() {
    //Populate the array
    this.starsAmount =
      (((this.canvas.width * this.canvas.height) / 2000) | 0) < this.MAX_STARS
        ? ((this.canvas.width * this.canvas.height) / 2000) | 0
        : this.MAX_STARS;

    for (let i = 0; i < this.starsAmount; i++) {
      this.stars.push(
        new StarModule(
          (Math.random() * this.canvas.width) / this.ratio,
          (Math.random() * this.canvas.height) / this.ratio,
          this
        )
      );
    }
  }
  init() {
    this.populate();
    setInterval(this.updateFps, 1000);
    this.loop();
  }
  loop() {
    this.fpsCounter++;
    this.updateDeltaTime();
    // Clears the canvas
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Starts the lines path
    this.c.strokeStyle = "#393d4e";
    this.c.beginPath();

    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].compute(this.canvas, this.deltaTime, this.ratio);
      /* check if stars are obfuscated
      if (insideSquare(stars[i], topSq) || insideSquare(stars[i], mainSq) || insideSquare(stars[i], footerSq)) {

          continue;
      } 
      */
      this.stars[i].render(this.c, this.ratio, this.stars);
    }
    // Closes the lines path
    this.c.closePath();
    this.c.stroke();
    requestAnimationFrame(this.loop);
  }
}

// Moving star Constructor
export class StarModule {
  constructor(x = 0, y = 0, starsService) {
    this.x = x;
    this.y = y;
    this.w = 2;
    this.h = 2;
    this.speed = Math.random() * 0.2 + 0.1 - 0.15;
    this.xVel = this.speed;
    this.yVel = this.speed;
    this.xVelExt = 0;
    this.yVelExt = 0;
    this.friction = 0.97;
    this.neighbour = -1;

    this.starsService = starsService;
    this.rotation = 135;
    this.connectNeighbours(starsService.stars);
  }

  checkBounds(canvas, ratio) {
    if (this.x + this.w < 0) {
      this.x = canvas.width / ratio + (this.x % (canvas.width / ratio));
    } else if (this.x > canvas.width / ratio) {
      this.x = this.x % (canvas.width / ratio);
    }
    if (this.y + this.h < 0) {
      this.y = canvas.height / ratio + (this.y % (canvas.width / ratio));
    } else if (this.y > canvas.height / ratio) {
      this.y = this.y % (canvas.height / ratio);
    }
  }
  connectNeighbours(stars) {
    let min,
      updated = false;
    let square = {
      x: 0,
      y: 0,
      w: 100,
      h: 100,
    };
    square.x = this.x - square.w / 2;
    square.y = this.y - square.h / 2;
    for (let i = 0; i < stars.length; i++) {
      if (stars[stars[i].neighbour] === this) {
        continue;
      }
      if (stars[i] === this) {
        continue;
      }
      if (!pointSquareCol(stars[i], square)) {
        continue;
      }
      let distance = getDistance(this.x, this.y, stars[i].x, stars[i].y);
      if (min === undefined) {
        min = distance;
        this.neighbour = i;
        updated = true;
      } else if (distance < min) {
        min = distance;
        this.neighbour = i;
        updated = true;
      }
    }
    if (!updated) {
      this.neighbour = 0;
    }
  }
  compute(canvas, deltaTime, ratio) {
    if (Math.abs(this.xVelExt) > 0.01) {
      this.xVelExt *= Math.pow(this.friction, deltaTime);
    } else if (this.xVelExt !== 0) {
      this.xVelExt = 0;
    }
    if (Math.abs(this.yVelExt) > 0.01) {
      this.yVelExt *= Math.pow(this.friction, deltaTime);
    } else if (this.yVelExt !== 0) {
      this.yVelExt = 0;
    }

    this.x += (this.xVel + this.xVelExt) * deltaTime;
    this.y += (this.yVel + this.yVelExt) * deltaTime;
    this.checkBounds(canvas, ratio);
  }
  render(c, ratio, stars) {
    this.connectNeighbours(stars);
    if (this.neighbour) {
      c.moveTo(this.x, this.y);
      c.lineTo(stars[this.neighbour].x, stars[this.neighbour].y);
    }

    c.fillStyle = "#bec2cf";
    c.fillRect(this.x * ratio, this.y * ratio, this.w * ratio, this.h * ratio);
  }
}

export function getDistance(xA, yA, xB, yB) {
  var xDiff = xA - xB;
  var yDiff = yA - yB;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
export function pointCircle(px, py, cx, cy, r) {
  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  let distX = px - cx;
  let distY = py - cy;
  let distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
}
export function insideSquare(sq1, sq2) {
  if (sq1.x > sq2.x && sq1.x + sq1.w < sq2.x + sq2.w) {
    if (sq1.y > sq2.y && sq1.y + sq1.h < sq2.y + sq2.h) {
      return true;
    }
  }
  return false;
}

export function collided(a, b) {
  var square1 = a.hitbox ? a.hitbox : a;
  var square2 = b.hitbox ? b.hitbox : b;
  if (square1.x < square2.x + square2.w) {
    if (square1.x + square1.w > square2.x) {
      if (square1.y < square2.y + square2.h) {
        if (square1.y + square1.h > square2.y) {
          return true;
        }
      }
    }
  }
  return false;
}

export function pointSquareCol(point, sq) {
  var square = sq;
  if (sq.hitbox !== undefined) {
    square = sq.hitbox;
  }
  if (point.x > square.x) {
    if (point.x < square.x + square.w) {
      if (point.y > square.y) {
        if (point.y < square.y + square.h) {
          return true;
        }
      }
    }
  }
  return false;
}
export function getAngle(x1, y1, x2, y2) {
  let deltaX = x2 - x1;
  let deltaY = y2 - y1;
  let rotation = Math.atan2(deltaY, deltaX);
  return rotation;
}
