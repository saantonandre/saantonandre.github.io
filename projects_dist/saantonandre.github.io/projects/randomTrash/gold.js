window.onload = function () {
    var mouseX;
    var mouseY;
    var canvas = document.getElementById("canvas");
    var upward = document.getElementById("upward");
    var level = document.getElementById("level");
    var uptop = 0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.style.backgroundSize = "cover";

    var coinSound = new Audio("https://saantonandre.github.io/coinsound.mp3");
    var coinSound2 = new Audio("https://saantonandre.github.io/coinsound.mp3");
    var coinSound3 = new Audio("https://saantonandre.github.io/coinsound.mp3");
    var coinSound4 = new Audio("https://saantonandre.github.io/coinsound.mp3");
    var coinSound5 = new Audio("https://saantonandre.github.io/coinsound.mp3");
    var coinSound6 = new Audio("https://saantonandre.github.io/coinsound.mp3");
    var c = canvas.getContext("2d");
    var coinX = [0, 100, 200, 300, 400, 500, 600];
    var coinSprite = document.getElementById("coinSprite");
    var coins = [];
    iterCoin = 0;
    iterCoin2 = 0;
    var coinsNum = 1;
    var CR = 1;
    var points = 0;
    var collected = document.getElementById("collected");
    canvas.addEventListener("click", setAudio)

    function setAudio() {
        coinSound.play()
        coinSound.pause()
        coinSound2.play()
        coinSound2.pause()
        coinSound3.play()
        coinSound3.pause()
        coinSound4.play()
        coinSound4.pause()
        coinSound5.play()
        coinSound5.pause()
        coinSound6.play()
        coinSound6.pause()
        document.addEventListener("touchmove", trackPos2);
        canvas.removeEventListener("click", setAudio)
    }



    class Coin {
        constructor(xx, yy, sz) {
            coins.push({
                x: xx,
                y: yy,
                sz: sz
            });
        }
    }
    var scr = Math.min(window.innerWidth, window.innerHeight);
    var deletedCoins = 0;

    function resetCoins() {
        coinsNum++;
        CR++;
        level.innerHTML = "level: -<b>" + CR + "</b>-";
        coins = []
        for (j = 0; j < CR; j++) {
            for (i = 0; i < CR; i++) {
                new Coin(scr / CR * i, scr / CR * (j), scr / CR)
            }
        }
        deletedCoins = 0;
    }
    document.addEventListener("click", trackPos);

    function trackPos(evt) {
        mouseX = evt.clientX;
        mouseY = evt.clientY;
        for (i = 0; i < coins.length; i++) {
            if (mouseX > coins[i].x && mouseX < coins[i].x + coins[i].sz &&
                mouseY > coins[i].y && mouseY < coins[i].y + coins[i].sz) {
                delete coins[i].x;
                deletedCoins++;
                points++;
                collected.innerHTML = "collected: " + points;
                upward.innerHTML = "";
                if (deletedCoins == coins.length) {
                    setTimeout(resetCoins, 200);
                }
                if (coinSound.paused) {
                    coinSound.play();
                } else if (coinSound2.paused) {
                    coinSound2.play();
                } else if (coinSound3.paused) {
                    coinSound3.play();
                } else if (coinSound4.paused) {
                    coinSound4.play();
                } else if (coinSound5.paused) {
                    coinSound5.play();
                } else if (coinSound6.paused) {
                    coinSound6.play();
                }
            }
        }

    }
    new Coin(0, 0, scr / coinsNum)

    function trackPos2(event) {
        mouseX = event.targetTouches[0].clientX;
        mouseY = event.targetTouches[0].clientY;

        for (i = 0; i < coins.length; i++) {
            if (mouseX > coins[i].x && mouseX < coins[i].x + coins[i].sz &&
                mouseY > coins[i].y && mouseY < coins[i].y + coins[i].sz) {
                delete coins[i].x;
                deletedCoins++;
                points++;
                collected.innerHTML = "collected: " + points;
                upward.innerHTML = "";
                if (deletedCoins == coins.length) {
                    setTimeout(resetCoins, 200);
                }
                if (coinSound.paused) {
                    coinSound.play();
                } else if (coinSound2.paused) {
                    coinSound2.play();
                } else if (coinSound3.paused) {
                    coinSound3.play();
                } else if (coinSound4.paused) {
                    coinSound4.play();
                } else if (coinSound5.paused) {
                    coinSound5.play();
                } else if (coinSound6.paused) {
                    coinSound6.play();
                }
            }
        }

    }
    requestAnimationFrame(loop)

    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height)
        iterCoin++;
        if (iterCoin % 5 === 0) {
            iterCoin2++;
        }
        if (iterCoin2 >= coinX.length) {
            iterCoin2 = 0;
        }
        for (i = 0; i < coins.length; i++) {
            c.drawImage(coinSprite, coinX[iterCoin2], 0, 100, 100, coins[i].x, coins[i].y, coins[i].sz, coins[i].sz);
        }
        upward.style.top = uptop + "px";
        uptop++;
        requestAnimationFrame(loop);
    }
}
