function id(arg) {
    return document.getElementById(arg);
}
let inputCont = id("sound");

let audioCtx, analyser, dataArray, bufferLength;
if (navigator.mediaDevices.getUserMedia) {
    // getUserMedia supported




    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(onSuccess, onError);

}

function loop() {

    analyser.getByteTimeDomainData(dataArray);

    for (let i = 0; i < (bufferLength / 128 | 0); i++) {
        inputArr[i].value = dataArray[(bufferLength / 128 | 0)*i]/256*100
    }
    requestAnimationFrame(loop);
}

let inputArr = [];

function onSuccess(stream) {
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.start();

    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    const source = audioCtx.createMediaStreamSource(stream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    
    dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    for (let i = 0; i < (bufferLength / 128 | 0); i++) {
        let newInput = document.createElement("input");
        newInput.type = "range";
        inputCont.appendChild(newInput);
        inputArr.push(newInput)
    }
    loop()
}

function onError(err) {
    console.log("Error: " + err);
}