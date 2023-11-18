// Controls class
class Controls {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.spacebar = false;
    this.e = false;
    this.q = false;
    this.lClickDown = false;
    this.rClickDown = false;
    this.test = "test";
    this.currentPos = 0;
    this.lastDir = 0;
    this.initListeners(this);
  }
  // Event Listeners (to change controls' values)
  initListeners(x) {
    /*
        document.oncontextmenu = function () {
            player.onSkate = !player.onSkate;
            return false;
        }
        */
    document.addEventListener("mousedown", function (evt) {
      switch (evt.which) {
        case 1:
          debug.log("Left MouseDown");
          x.lClickDown = true;
          break;
        case 3:
          debug.log("Right MouseDown");
          x.rClickDown = true;
          break;
      }
    });
    document.addEventListener("mouseup", function (evt) {
      switch (evt.which) {
        case 1:
          debug.log("Left MouseUp");
          x.lClickDown = false;
          break;
        case 2:
          console.log(
            "x: " +
              (cursor.mapPos.x - map.x) +
              ", y: " +
              (cursor.mapPos.y - map.y)
          );
          break;
        case 3:
          debug.log("Right MouseUp");
          x.rClickDown = false;
          break;
      }
    });
    document.addEventListener("keydown", function (evt) {
      switch (evt.keyCode) {
        case 87: //up
        case 38:
          debug.log("Up key");
          if (!x.up) {
            x.up = true;
            x.lastDir = 1;
          }
          break;
        case 32:
          x.spacebar = true;
          break;
        case 83: //down
        case 40: //down
          debug.log("Down key");
          if (!x.down) {
            x.down = true;
            x.lastDir = 3;
          }
          break;
        case 65: //left
        case 37: //left
          debug.log("Left key");
          if (!x.left) {
            x.left = true;
            x.lastDir = 0;
          }
          break;
        case 68: //right
        case 39: //right
          debug.log("Right key");
          if (!x.right) {
            x.right = true;
            x.lastDir = 2;
          }
          break;
        case 69: //e
          debug.log("E key");
          if (!x.e) {
            x.e = true;
          }
          break;
        case 81: //q
          debug.log("Q key");
          if (!x.q) {
            x.q = true;
          }
          break;
        case 84: //t
          debug.log("T key down");
          x.t = true;
          break;
      }
    });
    document.addEventListener("keyup", function (evt) {
      switch (evt.keyCode) {
        case 87: //up
        case 38:
          x.up = false;
          break;
        case 32:
          x.spacebar = false;
          break;
        case 83: //down
        case 40: //down
          x.down = false;
          break;
        case 65: //left
        case 37: //left
          x.left = false;
          break;
        case 68: //right
        case 39: //right
          x.right = false;
          break;
        case 69: //e
          x.e = false;
          break;
        case 81: //q
          if (x.q) {
            x.q = false;
          }
          break;
        case 27: // Escape
          saveGame();
          if (!sounds.shanty_1.paused) {
            sounds.shanty_1.pause();
          }
          if (!sounds.shanty_2.paused) {
            sounds.shanty_2.pause();
          }
          if (!sounds.shanty_3.paused) {
            sounds.shanty_3.pause();
          }
          meta.loopType = 2;
          break;
        case 84: //t
          debug.log("T key up");
          x.t = false;
          break;
        case 89: //y
          debug.log("Y key up");
          //toggleFullScreen();
          //resizeCanvas();
          break;
        //debug
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
          if (debug.on) {
            /*
                        unload();
                        currentPoint.level = (evt.keyCode - 96)
                        loadCall = 1;
                        //*/
          }
          /*
                    map.currentLevel = 17;
                    loadLevel();
                    loadGame();
                    //*/
          break;
      }
    });

    /* Mobile controls
        id("left").addEventListener("touchstart", function () {
            debug.log("Left key");
            if (!x.left) {
                x.left = true;
                x.lastDir = 0;
                id("left").style.transform = "scale(1.5)";
                id("left").style.opacity = "1";
            }
        });

        id("right").addEventListener("touchstart", function () {
            debug.log("Right key");
            if (!x.right) {
                x.right = true;
                x.lastDir = 2;
                id("right").style.transform = "scale(1.5)";
                id("right").style.opacity = "1";
            }
        });

        id("up").addEventListener("touchstart", function () {
            debug.log("Up key");
            if (!x.up) {
                x.up = true;
                id("up").style.transform = "scale(1.5)";
                id("up").style.opacity = "1";
                x.lastDir = 1;
            }
        });
        id("down").addEventListener("touchstart", function () {
            debug.log("E key");
            if (!x.e) {
                x.e = true;
                id("down").style.transform = "scale(1.5)";
                id("down").style.opacity = "1";
            }
        });
        id("left").addEventListener("touchend", function () {
            x.left = false;
            id("left").style.transform = "";
            id("left").style.opacity = "0.5";
        });
        id("right").addEventListener("touchend", function () {
            x.right = false;
            id("right").style.transform = "";
            id("right").style.opacity = "0.5";
        });
        id("up").addEventListener("touchend", function () {
            x.up = false;
            id("up").style.transform = "";
            id("up").style.opacity = "0.5";
        });
        id("down").addEventListener("touchend", function () {
            x.e = false;
            id("down").style.transform = "";
            id("down").style.opacity = "0.5";
        });
        //*/
  }
}
