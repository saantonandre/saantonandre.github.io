/**
 * Provides functionalities relative to sound streams
 */
export class SoundStream {
    constructor() {

        /**
         * @type {AudioContext}
         */
        this.audioContext;

        /**
         * @type {AnalyserNode}
         */
        this.analyser;

        /**
         * @type {MediaRecorder}
         */
        this.mediaRecorder;


        /**
         * @type {Uint8Array}
         */
        this.dataArray;
    }
    /**
     * Initializes the sound stream
     */
    initialize() {
        // Return
        let promise = navigator.mediaDevices.getUserMedia({ audio: true })
            .then(this.onSuccessMediaRequest, this.onSuccessMediaRequest);
        return promise;
    }
    maxIndex(){
    let max = 0,maxID = 0;
    this.dataArray.map((fr, index) =>{
        if( fr > max){
            maxID = index;
            max = fr;
        }
    })
    return maxID;
    }
    /**
     * @param {MediaStream} stream
     */
    onSuccessMediaRequest = (stream) => {
        console.log("Successfully obstained microphone access")
        // Creates a media recorder from the microphone stream
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.start();

        this.audioContext = new AudioContext();

        this.streamSource = this.audioContext.createMediaStreamSource(stream);

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;

        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.streamSource.connect(this.analyser);
    }
    /**
     * @param {String} error 
     */
    onFailureMediaRequest = (error) => {
        console.log("Error while requesting microphone access: " + error);
    }

    update() {
        this.analyser.getByteFrequencyData(this.dataArray);
    }

}