window.onload = function() {
var x = 5;
var z = 0;
alert("Tap the screen to create a set of x random squares with randomized properties values \n\nIm really satysfied about this program, because of the different applications it may have.\nYou might need this whenever you need inspiration for an original design for a draw, an architecture, or even as an alternative form of a Rorschach Test.\nIf you got some spare time please leave a comment and let me know how I could improve this!");
var divi = document.getElementById("rand");
document.addEventListener("click",myfunc);
var colors = ["white","red","yellow","orange","antiquewhite","violet","lightblue","blue","black","green","purple"]



function myfunc() {
var myNode = document.getElementById("container"); 
while (myNode.firstChild) { myNode.removeChild(myNode.firstChild); }
for (i=0;i<x;i++) {
var rand1 = Math.floor(Math.random() *40+1);
var rand2 = Math.floor(Math.random() *40+1);
var rand3 = Math.floor(Math.random() *200+1);
var rand4 = Math.floor(Math.random() *200+1);
var rand5 = Math.floor(Math.random() *50+1);
var rand6 = Math.floor(Math.random() *10+1);
var rand7 = Math.floor(Math.random() *3+1);
var divi = document.createElement("div"); 
document.getElementById("container").appendChild(divi);
//divi.innerHTML = rand1+" "+rand2;
divi.style.top = rand1+10+"vh";
divi.style.left = rand2+"vw";
    
if (z%2 != 1) {
divi.style.backgroundColor = colors[rand6];
divi.style.border = "2px solid black";
} else {
    divi.style.border = "0px";
    divi.style.backgroundColor = "black";
}
    
divi.style.width = rand3+"px";
divi.style.height = rand4+"px";
divi.style.zIndex = rand7;
divi.style.display = "inline-block";
divi.style.position = "absolute";
}
}

document.getElementById("changex").addEventListener("click",function changex() {
    x = prompt("Enter the number of squares you need");
});
document.getElementById("removecb").addEventListener("click",function removecb() {
z++;
});

}