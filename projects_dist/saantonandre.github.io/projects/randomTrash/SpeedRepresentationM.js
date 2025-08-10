var speed = [36,360,3600];
var y = 0;
var z = 0;
var d = 0;

function func() {
    var userinput = document.getElementById("userinput").value;
    var box = document.getElementById("box");
   x = speed[y] / userinput;
   box.style["animation-duration"] = x + "s";
}
function changelength() {
   var road = document.getElementById("container");
   var lenghttxt = document.getElementById("arealength");
   var box = document.getElementById("box");
   
    y++;
    if (y > 2) {
        y = 0;
    }
    switch (y) {
        case 0:
        lenghttxt.innerHTML = "<-- 10 m -->";
        box.style.width = "95px";
        box.style.left = "-95px";
        road.style.backgroundSize = "auto 100px";
        break;
        case 1:
        lenghttxt.innerHTML = "<-- 100 m -->";
        box.style.width = "15px";
        box.style.left = "-15px";
        road.style.backgroundSize = "auto 18px";
        break; 
        case 2:
        lenghttxt.innerHTML = "<-- 1 Km -->";
        box.style.width = "6px";
        box.style.left = "-6px";
        road.style.backgroundSize = "auto 8px";
        break;    
    }
    
    func();
}

function changevehicle() {
    var vehicles = ["http://www.clker.com/cliparts/q/0/m/g/P/c/red-sports-car-top-view.svg", "http://pngimg.com/uploads/formula_1/formula_1_PNG32.png", "http://pngriver.com/wp-content/uploads/2017/11/cat-kitten-transparent-png-images-free-download-037.png"];
    var vehicle = document.getElementById("box");
    z++;
    if (z > 2) {
    z = 0;
    }
    vehicle.src = vehicles[z];  
}
function dejavu() {
    d++;
    var dejabtn = document.getElementById("dejavu");
    if (d%2 == 0) {
    var box = document.getElementById("box");
    box.style.transform = "rotate(0deg)";
    dejabtn.style.top = "-10px";
    dejabtn.style.removeProperty("animation-name");
    dejabtn.style.animationName = "dejabtn2";
    document.getElementById("userinput").style.fontFamily = "'VT323', monospace";
    document.getElementById("userinput").placeholder = "Enter speed (Km/h)";
    }
    if (d%2 == 1) {
        var box = document.getElementById("box");
        box.style.transform = "rotate(30deg)";
        dejabtn.style.top = "0px";
        dejabtn.style.removeProperty("animation-name");
        dejabtn.style.animationName = "dejabtn";
        document.getElementById("userinput").style.fontFamily = "'Stalinist One', cursive";
        document.getElementById("userinput").placeholder = "!!!!!!!!!!!!!!";
    }
}