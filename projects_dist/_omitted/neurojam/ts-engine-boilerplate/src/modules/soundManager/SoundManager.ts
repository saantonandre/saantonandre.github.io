
class SoundManager {
    playbackRate:number = 1;
    volume:number = 1;
    sounds:any = {
        playRandom: (soundsArray:string[]) => {
            this.sounds[soundsArray[(Math.random() * soundsArray.length | 0)]].play()
        }
    };
    soundsBaseUrl = 'assets/soundFxs/';
    constructor() {
    }
    /** takes an argument the sound file name (without extension) from the relative path in soundsBaseUrl */
    createSound = (relativeUrl:string, loop = false, volume = 1, playbackRate = 1) => {
        let fullUrl = `${this.soundsBaseUrl}${relativeUrl}.mp3`;
        let splittedUrl = relativeUrl.split('/');
        /** Extrapolates the name from the url */
        let name = splittedUrl[splittedUrl.length - 1];
        this.sounds[name] = new CustomAudio(fullUrl, loop, volume, playbackRate);
    }
}
class CustomAudio {
    audio:HTMLAudioElement;
    loop:boolean = false;
    volume:number = 1;
    playbackRate:number = 1;
    calledPlayPromise = false;
    constructor(url:string, loop = false, volume = 1, playbackRate = 1) {
        this.audio = new Audio(url);
        this.loop = loop;
        this.volume = volume;
        this.playbackRate = playbackRate;
    }
    play = (customVolume = 1, customPlaybackRate = 1) => {
        if (this.calledPlayPromise) {
            /** A play promise has been already called, do nothing */
            return false;
        }
        /** Sets the audio volume */
        this.audio.volume = this.volume * customVolume;
        /** Sets the audio volume */
        this.audio.loop = this.loop;
        /** Sets the audio speed */
        this.audio.playbackRate = this.playbackRate * customPlaybackRate;

        if (this.audio.paused) {
            /** If the audio is paused, just play it */
            if (!this.audio.loop) {
                /** If it isn't a loop reset the time */
                this.audio.currentTime = 0;
            }
        } else {
            /** If the audio is already running */
            if (this.audio.loop) {
                /** If it is a loop, do nothing */
                return;
            }
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        /** Call the play promise */
        let promise = this.audio.play();
        this.calledPlayPromise = true;
        if (promise !== undefined) {
            promise.catch((e)=>{
                /** Error response */
                console.warn("there was an audio error!", e)
                this.calledPlayPromise = false;
            }).then(() => {
                this.calledPlayPromise = false;
            })
        }
    }
}
const soundManager = new SoundManager();
export { soundManager };
export default soundManager;
/** Player sounds */
// eg. sound creation
// soundManager.createSound('sword-attack');
// soundManager.createSound('sword-hit');
// soundManager.createSound('pick-up');
// soundManager.createSound('damaged');