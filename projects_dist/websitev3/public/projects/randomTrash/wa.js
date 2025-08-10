window.onload = function () {
    var first = true;
    var send = false;
    var text = document.getElementById("text");
    var camera = document.getElementById("camera");
    var arrow = document.getElementById("arrow");
    var call = document.getElementById("call");
    var link = document.getElementById("link");
    var dots = document.getElementById("dots");
    var avatar = document.getElementById("avatar");
    var msgContainer = document.getElementById("msgContainer");
    var mic = document.getElementById("mic");
    var online = document.getElementById("online");
    var padding = document.getElementById("padding");
    camera.onclick = function () {
        console.log("...I can't do that")
    }
    emoji.onclick = function () {
        console.log("you don't really need emojis.")
    }
    arrow.onclick = function () {
        console.log("where do you want to go?? you can't.")
    }
    call.onclick = function () {
        console.log("not working. I wouldn't answer your call anyway!")
    }
    link.onclick = function () {
        console.log("ok maybe i could let you do this, but now its not the moment")
    }
    dots.onclick = function () {
        console.log("no")
    }
    camera.onclick = function () {
        console.log("I dont feel the urge to see your face, sorry")
    }
    var yourText;
    document.body.onclick = function () {
        send = false;
        mic.innerHTML = "<img src='https://image.flaticon.com/icons/svg/25/25682.svg'>";
    }

    text.oninput = function () {
        if (!send) {
            send = true;
            mic.innerHTML = "<img src='https://image.flaticon.com/icons/svg/60/60525.svg'>";

        }
    };
    mic.onclick = function () {
        if (!send) {
            console.log("sorry, I'm not able to do that :(")
        } else {
            text = document.getElementById("text");
            yourText = text.value;
            text.value = "";
            newMsg = document.createElement("div");
            node = document.createTextNode(yourText);
            newMsg.appendChild(node);
            newMsg.classList.add("msg1");
            if (first) {
                respond();
                newMsg.classList.add("first-msg1");
                first = false;
            }
            insertAfter(newMsg, padding);
        }

    }

    function respond() {
        setTimeout(function () {
            online.innerHTML = "online"
        }, 3000)
        setTimeout(function () {
            online.innerHTML = "typing..."
        }, 5000)
        setTimeout(function () {
            newRespond("who tf are you???");
            online.innerHTML = "online"
        }, 6000)
        setTimeout(function () {
            online.innerHTML = "typing..."
        }, 6800)
        setTimeout(function () {
            newRespond("how do you have my number?!");
            online.innerHTML = "online"
        }, 8300);
        setTimeout(function () {
            online.innerHTML = "typing..."
        }, 13000)
        setTimeout(function () {
            newRespond("...well");
            online.innerHTML = "online"
        }, 15000);
        setTimeout(function () {
            online.innerHTML = "typing..."
        }, 15500)
        setTimeout(function () {
            newRespond("sorry but I have to just ignore you. I'm busy correcting this exact program, if you mind giving a look at my other programs i would really appreaciate that u_u");
            online.innerHTML = "online"
        }, 22000);
        setTimeout(function () {
            newMsg2 = document.createElement("div");
            kitten = document.createElement("img");
            kitten.src = "http://pulpbits.net/wp-content/uploads/2014/02/Persian-Cat-Price-330x220.jpg";
            node2 = document.createTextNode("still here?? you creepy");
            newMsg2.appendChild(kitten);
            newMsg2.appendChild(node2);
            newMsg2.classList.add("msg2");
            newMsg2.classList.add("first-msg2");
            insertAfter(newMsg2, padding);
        }, 40000);
        setTimeout(function () {
            online.innerHTML = "last seen today at " + new Date().getHours() + ":" + new Date().getMinutes();
        }, 26500)
    }

    function newRespond(txt) {
        newMsg2 = document.createElement("div");
        node2 = document.createTextNode(txt);
        newMsg2.appendChild(node2);
        newMsg2.classList.add("msg2");
        newMsg2.classList.add("first-msg2");
        insertAfter(newMsg2, padding);
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

}
