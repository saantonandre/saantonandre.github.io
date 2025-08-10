function id(arg) {
    return document.getElementById(arg);
}
var canvas = id("canvas");
var c = canvas.getContext("2d");


var file = id("file-input")
const MAX_SIZE = 400;
file.oninput = handleImage;
var img;
var ratio;
function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        img = new Image();
        img.onload = function () {

            ratio = 1;
            max = 0;
            if (img.width > img.height) {
                max = img.width;
            } else {
                max = img.height;
            }
            if (max > MAX_SIZE) {
                ratio = max / MAX_SIZE;
            }
            canvas.width = (img.width / ratio);
            canvas.height = img.height / ratio;

            c.drawImage(img, 0, 0, img.width / ratio, img.height / ratio);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}
/*
button.onclick = function (e) {
    let x;
    let y;
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            var pixel = c.getImageData(i, j, 1, 1);
            var data = pixel.data;
            //var rgba = 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + (data[3] / 255) + ')';
            let winner = 3
            let winner2 = 3
            if (data[0] > data[1] && data[0] > data[2]) {
                winner = 0;

                data[1] > data[2] ? winner2 = 1 : winner2 = 2;

            } else if (data[1] > data[0] && data[1] > data[2]) {
                winner = 1;

                data[0] > data[2] ? winner2 = 0 : winner2 = 2;
            } else if (data[2] > data[1] && data[2] > data[0]) {
                winner = 2;

                data[1] > data[0] ? winner2 = 1 : winner2 = 0;
            } else {
                winner = 3;
            }
            let hex = ['0', '0', '0'];
            if (winner !== 3) {
                if (data[winner] > 100) {
                    hex[winner] = 'f';
                } else {
                    hex[winner] = '0';
                }
                if (data[winner2] > 50) {
                    hex[winner2] = 'f';
                } else {
                    hex[winner2] = '0';
                }
            }
            c.fillStyle = "#" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            c.fillRect(i, j, 1, 1)
        }
    }

}
*/
button.onclick = function (e) {
    
    let x;
    let y;
    for (let i = 0; i < img.width/ratio; i += 1) {
        for (let j = 0; j < img.height/ratio; j += 1) {
            var pixel = c.getImageData(i, j, 1, 1);
            var data = pixel.data;
            let rand1 = Math.random() * 3;
            let rand2 = Math.random() * 3;
            let hex = ['0', '0', '0'];
            hex[0] = list[(data[0] / 256 * 16) | 0];
            hex[1] = list[(data[1] / 256 * 16) | 0];
            hex[2] = list[(data[2] / 256 * 16) | 0];
            c.fillStyle = "#" + hex[0] + hex[1] + hex[2];
            c.fillRect(i, j, rand1, rand2)
        }
    }
    console.log("done")
}
var list = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
var list2 = ['0', '2', '4', '6', '8', 'a', 'c', 'e'];
var list3 = ['0', '4', '8', 'c'];
var list4 = ['0', '8'];

function randHex() {
    return list[(Math.random() * 16) | 0];
}
