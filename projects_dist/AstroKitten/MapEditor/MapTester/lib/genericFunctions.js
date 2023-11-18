function id(arg) {
  return document.getElementById(arg);
}

// To load local storage:
var canStorage = supports_html5_storage();
var isMobile = window.mobileAndTabletCheck();
if (isMobile) {
  // Create mobile UI
  createMobileUI();
}

function supports_html5_storage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}

function createMobileUI() {
  // Left element
  let left = document.createElement("div");
  left.style.position = "absolute";
  left.style.display = "inline-block";
  left.style.left = 0 + "px";
  left.style.bottom = 0 + "px";
  left.style.width = 25 + "vw";
  left.style.height = 25 + "vw";
  left.style.backgroundColor = "lightgreen";
  left.id = "left";
  document.body.appendChild(left);

  // Right element
  let right = document.createElement("div");
  right.style.position = "absolute";
  right.style.display = "inline-block";
  right.style.right = 0 + "px";
  right.style.bottom = 0 + "px";
  right.style.width = 25 + "vw";
  right.style.height = 25 + "vw";
  right.style.backgroundColor = "lightblue";
  right.id = "right";
  document.body.appendChild(right);

  // Up element
  let up = document.createElement("div");
  up.style.position = "absolute";
  up.style.display = "inline-block";
  up.style.left = window.innerWidth / 2 - (window.innerWidth * 0.125) + "px";
  up.style.bottom = 0 + "px";
  up.style.width = 25 + "vw";
  up.style.height = 25 + "vw";
  up.style.backgroundColor = "red";
  up.id = "up";
  document.body.appendChild(up);

  // Down element
  let down = document.createElement("div");
  down.style.position = "absolute";
  down.style.display = "inline-block";
  down.style.left = 0 + "px";
  down.style.bottom = 0 + "px";
  down.style.width = 25 + "vw";
  down.style.height = 25 + "vw";
  down.id = "down";
  down.style.display = "none";
  document.body.appendChild(down);

  // E element
  let e = document.createElement("div");
  e.style.position = "absolute";
  e.style.display = "inline-block";
  e.style.left = 0 + "px";
  e.style.top = 0 + "px";
  e.style.width = 25 + "vw";
  e.style.height = 25 + "vw";
  e.id = "e";
  down.style.display = "none";
  document.body.appendChild(e);

}
// returns [cos,sin]
function cosSin(x1, y1, x2, y2) {
  let deltaX = x2 - x1;
  let deltaY = y2 - y1;
  let rotation = Math.atan2(deltaY, deltaX);
  let xTarget = Math.cos(rotation);
  let yTarget = Math.sin(rotation);
  return [xTarget, yTarget];
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
var debug = {
  on: false,
  log: function (arg) {
    if (this.on) {
      console.log(arg);
    }
  },
};

function mobileAndTabletCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};


document.oncontextmenu = function () {
  return false;
};

function getRotation(obj1, obj2) {
  let x = obj1.x + obj1.w / 2;
  let y = obj1.y + obj1.h / 2;
  let x2 = obj2.x + obj2.w / 2;
  let y2 = obj2.y + obj2.h / 2;
  let deltaX = x2 - x;
  let deltaY = y2 - y;
  return Math.atan2(deltaY, deltaX);
}

function distance(obj1, obj2) {
  let x1 = obj1.w ? obj1.x + obj1.w / 2 : obj1.x;
  let y1 = obj1.h ? obj1.y + obj1.h / 2 : obj1.y;

  let x2 = obj2.w ? obj2.x + obj2.w / 2 : obj2.x;
  let y2 = obj2.h ? obj2.y + obj2.h / 2 : obj2.y;

  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}