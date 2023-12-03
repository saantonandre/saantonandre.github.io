window.onload = function () {
    var random;
    var bello;
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext('2d');
    var DO=new Audio("do2.wav");
    var RE=new Audio("re.wav");
    var MI=new Audio("mi.wav");
    var FA=new Audio("fa2.wav");
    var SOL=new Audio("sol2.wav");
    var LA=new Audio("la.wav");
    var SI=new Audio("si.wav");
    var applause=new Audio("applause.mp3");
    var piano=document.getElementById("piano");
    piano.addEventListener("click", function () {
        if(!conductorMode){conductorMode=1;piano.style.backgroundColor="black";piano.style.color="white";}else{conductorMode=0;piano.style.backgroundColor="white";piano.style.color="black";applause.play();}
    });
    
    /*Initializing all the image and sound effects. "tizio" is the italian word for "guy" while "ctv" stands for "cattivo", "bad guy"(implying the guy on the right is bad)*/
    var tizio1 = document.getElementById('tizio1');
    var tap = document.getElementById('tapCont');
    var tizio1b1 = document.getElementById('tizio1b1');
    var tizio1b2 = document.getElementById('tizio1b2');
    var tizio2 = document.getElementById('tizio2');
    var tiziofart = document.getElementById('tiziofart');
    var ctv = document.getElementById('ctv');
    var testactv = document.getElementById('testactv');
    var corpoctv = document.getElementById('corpoctv');
    var proj = document.getElementById('proj');
    var range = document.getElementById('range').value;
    var specialWeapon = document.getElementById("specialWeapon");
    var flowers = document.getElementById("flowers");
    var supportsVibrate = "vibrate" in navigator;
    /*This event listener wait for the click on the button to start the "special weapon" function*/
    specialWeapon.addEventListener("click", function () {
        fartFunc();
    });
    /*this event listener refresh the speed of the projectiles every time the range input changes in value */
    document.getElementById('range').addEventListener("change", function () {
        range = document.getElementById('range').value;
    });
    /*setting the canvas size to full screen */
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    setTimeout(function () {
        canvas.width = Math.max(window.innerWidth, document.body.clientWidth);
        canvas.height = Math.max(window.innerHeight, document.body.clientHeight);
    }, 500);
    /*initializing all the variables*/
    var displayTap=1;
    var farting = 0;
    var x = 0;
    var y = 0;
    var note;
    var angleDeg = 0;
    var bodyX = 40;
    var bodyY = 100;
    var originX = 15 + bodyX;
    var originY = 100 + bodyY;
    var armX = bodyX - 10;
    var armY = bodyY - 30;
    var ctvX = 276;
    var ctvR = -30;
    var speed = range;
    var armRec = -10;
    var idle1 = 0;
    var once = 0;
    var isRecoil = false;
    var fart = new Audio("fart.mp3");
    var shoot = new Audio("fake2.mp3");
    var pew = new Audio("pew1.mp3");
    var projectileAngle = [];
    var projectile = [];
    var laserAngle = [];
    var laser = [];
    var lasergun=0;
    var armXincrease = 25;
    var flowX = bodyX + 8;
    var goBack = 0;
    var flowY = 0;
    var laserButton=document.getElementById("lasergunBtn");
    var conductorMode=0;
    laserButton.addEventListener("click", function () {
        if(!lasergun){lasergun=1;laserButton.style.backgroundColor="black";laserButton.style.color="white";}else{lasergun=0;laserButton.style.backgroundColor="white";laserButton.style.color="black";}
    });
    playing = 0; 
    /*requestAnimationFrame really efficient api to make fluid animations between frames*/
    requestAnimationFrame(loop);

    function loop() { 
        /*each frame the canvas gets cleared to avoid the repeat of previous frames*/
        c.clearRect(0, 0, canvas.width, canvas.height);
        armXincrease = 25;
        c.drawImage(corpoctv, ctvX, 140, 80, 160); 
        /*checks if the guys is... expelling..? then the flowers spawns and move accordingly to what this condition says.*/
        if (farting) {
            armXincrease = 55;
            c.drawImage(flowers, flowX, bodyY + 130 + flowY, 80, 30);
            c.drawImage(tiziofart, bodyX, bodyY + 20, 140, 180);
            if (flowX <=
                bodyX - 55) {
                goBack = 1;
            }
            if (flowX > bodyX - 55 && !goBack) {
                flowX -= 1;
                goBack = 0;
            }
            if (goBack && bodyY + 130 + flowY + 30 < bodyY + 200) 
            {
                flowY += 6;
            }
        } else {
            if (playing) {
                if (random || lasergun) {
                    c.drawImage(tizio1b2, bodyX, bodyY, 90, 200);
                } else {
                    c.drawImage(tizio1b1, bodyX, bodyY, 90, 200);
                }
            } else {
                c.drawImage(tizio1, bodyX, bodyY, 90, 200);
            }
        }
        /* This block of code has the only purpose of rotating the right guy's head at random intervals*/
        c.save();
        c.translate(ctvX + 35, 73 + 40);
        c.rotate(ctvR * Math.PI / 180);
        c.drawImage(testactv, -35, -40, 70, 80);
        c.restore();
        if (ctvR < 10 && idle1 === 0) ctvR++;
        if (ctvR == 10 && once === 0) {
            once = 1;
            setTimeout(function () {
                idle1 = 1
            }, Math.floor(Math.random() * 3000));
        }
        if (ctvR == -20 && once === 1) {
            once = 0;
            setTimeout(function () {
                idle1 = 0
            }, Math.floor(Math.random() * 3000));
        }
        if (ctvR > -20 && idle1 == 1) {
            ctvR--;
        }
        /*this loop refresh each projectile position every frame*/
        for (i = 0; i < projectile.length; i++) {
            c.save();
            c.translate(armX + /*armXincrease*/25, armY + 140);
            c.rotate(projectileAngle[i] * Math.PI / 180);
            c.drawImage(proj, projectile[i], -30, 10, 5);
            c.restore();
            projectile[i] += parseFloat(range);
        }
        for (i = 0; i < laser.length; i++) {
            c.save();
            c.translate(armX + /*armXincrease*/25, armY + 140);
            c.rotate(laserAngle[i] * Math.PI / 180);
            c.fillStyle="red";
            c.fillRect(laser[i], -30, 8*range+5, 5);
            c.restore();
            laser[i] += parseFloat(range);
        }
        
        c.save(); 
        // these are the coordinates of the guy's shoulder, aka the rotate origin
        c.translate(armX + armXincrease, armY + 130);
        c.rotate(angleDeg * Math.PI / 180);
        c.drawImage(tizio2, armRec, -30, 130, 40);
        c.restore();
        
        /* the recoil moves back and forth the arm whenever the guy is shooting*/
        if (isRecoil) {
            armRec -= 4;
        }
        if (!isRecoil && armRec < -10) {
            armRec++;
        }
        /* calling again the "requestAnimationFrame" in order to make of this whole function an infinite loop */
        requestAnimationFrame(loop);
    }
    /*the recoil function gets called whenever you click/tap, it pushes a new element in the projectiles array, which stores every projectiles position*/
    function recoil() {
        /* to prevent you to shoot and fart togheter, the audio feels messy otherwise :\*/
        if (!farting) {
            var one = angleDeg;
            armRec = -10;
            setTimeout(function () {
                isRecoil = false;
            }, 50);
            isRecoil = true;
            if (lasergun&&!conductorMode){
            laserAngle.push(one);
            laser.push(100);
            }
            if(!lasergun&&!conductorMode){
            projectileAngle.push(one);
            projectile.push(100);
            } 
        }
    }
    /*this function also get called on click/tap and*/
    function shootMp3() {
        if (!farting && !conductorMode) {
            clearTimeout(bello);
            random = Math.floor(Math.random() * 2);
            if(lasergun){
                    shoot = new Audio("pew1.mp3");
                shoot.play();
                playing = 1;
                
                bello = setTimeout(function () {
                playing = 0;
                }, 600);
            }
            if (!lasergun){
                if (random) {
                    shoot = new Audio("fake1.mp3");
                } else {
                    shoot = new Audio("fake2.mp3");
                }
                shoot.play();
                playing = 1;
                
                bello = setTimeout(function () {
                playing = 0;
                }, 1250);
            }
        }
        if(conductorMode&&!farting){
            if (angleDeg<=90&&angleDeg>75){
            note=new Audio("la.wav");
            note.play();
            }
            if (angleDeg<=75&&angleDeg>50){
            note=new Audio("si.wav");
            note.play();
            }
            if (angleDeg<=50&&angleDeg>25){
            note=new Audio("do2.wav");
            note.play();
            }
            if (angleDeg<=25&&angleDeg>0){
            note=new Audio("re.wav");
            note.play();
            }
            if (angleDeg<=0&&angleDeg>-25){
            note=new Audio("mi.wav");
            note.play();
            }
            if (angleDeg<=-25&&angleDeg>-60){
            note=new Audio("fa2.wav");
            note.play();
            }
            if (angleDeg<=-60&&angleDeg>-90){
            note=new Audio("sol2.wav");
            note.play();
            }
        }
    }

    function fartFunc() {
        /* this function initialize the flowers positions and starts the audio */
        if (!farting) {
        if (supportsVibrate){
            navigator.vibrate(1000);
            }
            clearTimeout(fart);
            fart = new Audio("fart.mp3");
            fart.play();
            farting = 1;
            goBack = 0;
            flowY = 0;
            flowX = bodyX + 8;
            fart = setTimeout(function () {
                farting = 0;}, 1500);
        }
    }
    canvas.addEventListener("click", function () {
        recoil();
        shootMp3()
        if(displayTap){
        tap.style.display="none";
        displayTap=0;
        }
        
    });
    document.addEventListener("mousemove", trackPos);
    /* trackPos costantly tracks the mouse position and calculates the angle (with the atan2 formula) that the arm should assume */
    function trackPos(event) {
        x = event.clientX;
        y = event.clientY;
        angleDeg = Math.atan2(y - originY, x - originX) * 180 / Math.PI;
    }
}
