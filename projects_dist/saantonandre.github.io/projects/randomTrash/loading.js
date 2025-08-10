window.onload = function () {
    var dot = document.getElementById("dot");
    var x = 0;
    setInterval(func, 1000);

    function func() {
        dot.innerHTML += ".";
        x++;
        if (x > 5) {
            dot.innerHTML = "";
            x = 0;
        }
    }
    setTimeout(func2, 10000);

    function func2() {
        document.body.innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/b/b5/Rainbow_trout.png\" width=\"100%\">";

    }
}
