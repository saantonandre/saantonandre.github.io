window.onload = function () {
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext('2d');
    var head = document.getElementById('head');
    var torso = document.getElementById('torso');
    var arm = document.getElementById('arm');
    var forearm = document.getElementById('forearm');
    var leg = document.getElementById('leg');
    var subleg = document.getElementById('subleg');
    var foot = document.getElementById('foot');
    var pos = document.getElementById('pos');
    var rot0=0;
    /*setting the canvas size to full screen */
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    setTimeout(function () {
        canvas.width = Math.max(window.innerWidth, document.body.clientWidth);
        canvas.height = Math.max(window.innerHeight, document.body.clientHeight);
    }, 500);
    /*
    leg:     x:112 y:200
    knee:    x:122 y:247
    foot:    x:122 y:290
    arm:     x:110 y:140
    forearm: x:110 y:140
    */
    class head0{
        constructor(x,y,rot){
        c.save();
        c.translate(0, 0);
        c.rotate(rot * Math.PI / 180);
        c.drawImage(head,x,y-5,33,40);
        c.restore();
        }
    }
    class torso0{
        constructor(x,y,rot){
        c.save();
        c.translate(0, 0);
        c.rotate(rot * Math.PI / 180);
        c.drawImage(torso,x -10,y-10,40,90);
        c.restore();
        }
    }
    class arm0{
        constructor(rot1){
        c.save();
        c.translate(110,140);
        c.rotate(rot1 * Math.PI / 180);
        c.drawImage(arm,-3,-3,18,40);
        c.restore();
        }
    }
    class forearm0{
        constructor(rot1,rot2){
        c.save();
        c.translate(110,140);
        c.rotate(rot1 * Math.PI / 180);
        c.translate(3,35);
        c.rotate(rot2 * Math.PI / 180);
        c.drawImage(forearm,-3,-3,30,40);
        c.restore();
        }
    }
    class leg0{
        constructor(rot1){
            //the leg rotation is relative to the torso
        c.save();
        c.translate(112,200);
        c.rotate(rot1 * Math.PI / 180);
        c.drawImage(leg,-15,-5,30,60);
        c.restore();
        }
    }
    class subleg0{
            //the knee rotation is relative to the torso and to the leg
        constructor(rot1,rot2){
        c.save();
        c.translate(112, 200);
        c.rotate(rot1 * Math.PI / 180);
        c.translate(8, 47);
        c.rotate(rot2 * Math.PI / 180);
        c.drawImage(subleg,-7,-3,15,50);
        c.restore();
        }
    }
    class foot0{
            //the foot rotation is relative to the torso, to the leg, and to the knee
        constructor(rot1,rot2,rot3){
            
        c.save();
        c.translate(112, 200);
        c.rotate(rot1 * Math.PI / 180);
        c.translate(8, 47);
        c.rotate(rot2 * Math.PI / 180);
        c.translate(3, 45);
        c.rotate(rot3 * Math.PI / 180);
        c.drawImage(foot,-5,-5,30,20);
        c.restore();
        }
    }
        
    var armRot1=0;
    var forearmRot1=0;
    
    var armRot2=0;
    var forearmRot2=0;
    
    var legRot1=0;
    var sublegRot1=0;
    var footRot1=0;
    
    var legRot2=20;
    var sublegRot2=0;
    var footRot2=0;
    var x;
    var y;
        requestAnimationFrame(loop);
    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        
        leg1=new leg0(legRot1);
        subleg1=new subleg0(legRot1,sublegRot1);
        foot1=new foot0(legRot1,sublegRot1,footRot1);
        
        arm1=new arm0(armRot1);
        forearm1=new forearm0(armRot1,forearmRot1);
        
        head1=new head0(100,95);
        
        leg2=new leg0(legRot2);
        subleg2=new subleg0(legRot2,sublegRot2);
        foot2=new foot0(legRot2,sublegRot2,footRot2);
        torso1=new torso0(100,130);

        
        arm2=new arm0(armRot2);
        forearm2=new forearm0(armRot2,forearmRot2);
        
        
        armRot1=(x-canvas.width/2)/1.8-30;
        forearmRot1=(y-canvas.height/2)/2-25;
        
        armRot2=(x-canvas.width/2)/1.8-30+10;
        forearmRot2=(y-canvas.height/2)/2-25;
        
        legRot1=(x-canvas.width/2)/2;
        sublegRot1=(y-canvas.height/2)/3+65;
        footRot1=(x-canvas.height/2)/3+10;
        
        legRot2=(x-canvas.width/2)/2+10;
        sublegRot2=(y-canvas.height/2)/3+65;
        footRot2=(x-canvas.height/2)/3+10;
        
        requestAnimationFrame(loop);
    }
    canvas.addEventListener("mousemove", trackPos);
    canvas.addEventListener("touchmove", trackPos2);
    /* trackPos costantly tracks the mouse position and calculates the angle (with the atan2 formula) that the arm should assume */
    function trackPos(event) {
        x = (event.clientX)*2;
        y = (event.clientY)*2;
        pos.innerHTML="pos X: "+x+"<br/>pos Y: "+y;
    }
    function trackPos2(event) {
        x = event.targetTouches[0].clientX;
        y = event.targetTouches[0].clientY;
        pos.innerHTML="touch X: "+x+"<br/>touch Y: "+y;
    }
}
