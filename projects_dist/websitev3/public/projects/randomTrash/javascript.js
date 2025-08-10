var msgdiprova = document.getElementById("msgdiprova");
var button2 = document.getElementById("button2");
msgdiprova.innerHTML = ("JAVASCRIPT ...");
msgdiprova.style.fontSize = "20px";

function merda () {
msgdiprova.innerHTML = ("JAVASCRIPT merda");
    }
function merda1 () {
msgdiprova.innerHTML = ("JAVASCRIPT ...");
}
msgdiprova.onmousedown = function () {merda ()};

msgdiprova.onmouseup = function () {merda1 ()};

dragElement(button2);

function dragElement(button2) {
    button2.onmousedown = dragMouseDown;
}
function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    button2.style.top = (button2.offsetTop - pos2) + "px";
    button2.style.left = (button2.offsetLeft - pos1) + "px";
}

function closeDragElement(){
    document.onmouseup = null;
    document.onmousemove = null;
}