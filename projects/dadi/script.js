function id(arg) {
    return document.getElementById(arg);
}
window.onload = function () {
    let aud = new Audio("wow.mp3");
    let attacking = 3;
    let defending = 3;
    let checks = [1, 1, 1, 1, 1, 1];
    let dadi_img = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];
    let dadi_div = [id("1"), id("2"), id("3"), id("4"), id("5"), id("6")];
    let tanks = document.getElementsByClassName("check");
    const SPRITE = id("dadi-img");
    let dadi = [1, 2, 3, 4, 5, 6];

    for (let i = 0; i < tanks.length; i++) {
        tanks[i].num = i;
        tanks[i].value = 1;
        tanks[i].onclick = function () {
            if (checks[this.num] == 0) {
                checks[this.num] = 1;
                this.classList.add("checked");
                if (this.num < 3) {
                    attacking++;
                } else {
                    defending++;
                }
            } else {
                checks[this.num] = 0;
                this.classList.remove("checked");
                if (this.num < 3) {
                    attacking--;
                } else {
                    defending--;
                }
            }
            checkVisibles()
        }
    }

    function checkVisibles() {
        if (attacking < 1) {
            dadi_div[0].style.visibility = "hidden";
            dadi_div[1].style.visibility = "hidden";
            dadi_div[2].style.visibility = "hidden";
        } else if (attacking < 2) {
            dadi_div[0].style.visibility = "visible";
            dadi_div[1].style.visibility = "hidden";
            dadi_div[2].style.visibility = "hidden";
        } else if (attacking < 3) {
            dadi_div[0].style.visibility = "visible";
            dadi_div[1].style.visibility = "visible";
            dadi_div[2].style.visibility = "hidden";
        } else {
            dadi_div[0].style.visibility = "visible";
            dadi_div[1].style.visibility = "visible";
            dadi_div[2].style.visibility = "visible";
        }

        if (defending < 1) {
            dadi_div[3].style.visibility = "hidden";
            dadi_div[4].style.visibility = "hidden";
            dadi_div[5].style.visibility = "hidden";
        } else if (defending < 2) {
            dadi_div[3].style.visibility = "visible";
            dadi_div[4].style.visibility = "hidden";
            dadi_div[5].style.visibility = "hidden";
        } else if (defending < 3) {
            dadi_div[3].style.visibility = "visible";
            dadi_div[4].style.visibility = "visible";
            dadi_div[5].style.visibility = "hidden";
        } else {
            dadi_div[3].style.visibility = "visible";
            dadi_div[4].style.visibility = "visible";
            dadi_div[5].style.visibility = "visible";
        }
    }

    function random(min, max) {
        return (Math.random() * (max + 1 - min) + min) | 0;
    }
    var counter = 0;

    var scambio = {};

    function scambia(a, b) {
        img_a = a.style.backgroundImage;
        val_a = a.value;
        a.style.backgroundImage = b.style.backgroundImage;
        a.value = b.value;
        b.style.backgroundImage = img_a;
        b.value = val_a;
    }

    function ordina() {
        if (attacking == 3) {
            for (let i = 0; i < 2; i++) {
                if (dadi_div[0].value < dadi_div[1].value) {
                    scambia(dadi_div[0], dadi_div[1])
                }
                if (dadi_div[1].value < dadi_div[2].value) {
                    scambia(dadi_div[1], dadi_div[2])
                }
            }
        } else if (attacking == 2) {
            if (dadi_div[0].value < dadi_div[1].value) {
                scambia(dadi_div[0], dadi_div[1])
            }
        }
        if (defending == 3) {
            for (let i = 0; i < 2; i++) {
                if (dadi_div[3].value < dadi_div[4].value) {
                    scambia(dadi_div[3], dadi_div[4])
                }
                if (dadi_div[4].value < dadi_div[5].value) {
                    scambia(dadi_div[4], dadi_div[5])
                }
            }
        } else if (defending == 2) {
            if (dadi_div[3].value < dadi_div[4].value) {
                scambia(dadi_div[3], dadi_div[4])
            }
        }
    }

    id("lancia").onclick = click;
    function click() {
        id("lancia").onclick = function(){};
        id("lancia").style.backgroundColor = "#306230";
        id("lancia").style.color = "#9bbc0f";
        id("lancia").style.border = "solid 3px #9bbc0f";
        if (aud.paused) {
            aud.play().catch(function (e) {});
        }
        id("text").innerHTML = "";
        var ripeti = setInterval(function () {
            if (counter < 15) {
                assegnaRandom();
                counter++;
            } else {
                clearInterval(ripeti);
                counter = 0;
                setTimeout(function () {
                    ordina();
                    confronta();
                    id("lancia").style.backgroundColor = "#9bbc0f";
                    id("lancia").style.color = "#306230";
                    id("lancia").style.border = "solid 3px #306230";
                    id("lancia").onclick = click;
                }, 500);
            }
        }, 100);
    }

    function confronta() {
        let attacco = 0;
        let difesa = 0;
        if (attacking && defending) {
            if (dadi_div[0].value > dadi_div[3].value) {
                difesa++;
            } else {
                attacco++;
            }
            if (attacking > 1 && defending > 1) {
                if (dadi_div[1].value > dadi_div[4].value) {
                    difesa++;
                } else {
                    attacco++;
                }
                if (attacking > 2 && defending > 2) {
                    if (dadi_div[2].value > dadi_div[5].value) {
                        difesa++;
                    } else {
                        attacco++;
                    }
                }
            }

            if (attacco > 0) {
                id("text").innerHTML = "ATTACCO perde " + attacco + "<br><br>";
            }
            if (difesa > 0) {
                id("text").innerHTML += "DIFESA perde " + difesa;
            }

        }
    }

    function assegnaRandom() {
        let rand;
        for (let i = 0; i < dadi.length; i++) {
            rand = random(0, 5);
            dadi_div[i].style.backgroundImage = "url(" + dadi_img[rand] + ")";
            dadi_div[i].value = rand + 1;
        }
    }

}
