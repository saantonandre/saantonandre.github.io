class Sounds {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;

        Audio.prototype.baseVolume = 1;
        Audio.prototype.isMusic = false;
        Audio.prototype.changeVolume = function () {
            let aud = this;
            if (aud.isMusic) {
                aud.volume = aud.baseVolume * meta.volume * meta.musicVolume;
            } else {
                aud.volume = aud.baseVolume * meta.volume * meta.sfxsVolume;
            }
        }
        Audio.prototype.playy = function () {
            let aud = this;
            aud.playbackRate = sounds.playbackRate;
            if (aud.isMusic) {
                aud.volume = aud.baseVolume * meta.volume * meta.musicVolume;
            } else {
                aud.volume = aud.baseVolume * meta.volume * meta.sfxsVolume;
            }
            if (aud.paused) {
                if (!aud.loop) {
                    aud.currentTime = 0;
                }
                let promise = aud.play();
                if (promise !== undefined) {
                    promise.catch(function (e) {});
                }
            } else {
                if (aud.loop) {
                    return;
                }
                aud.pause();
                aud.currentTime = 0;
                let promise = aud.play();
                if (promise !== undefined) {
                    promise.catch(function (e) {});
                }
            }
        };
    }
    changeGlobalVolume(targetVolume) {

    }
    changeGlobalPlaybackRate(playbackRate) {
        this.playbackRate = playbackRate;
    }
}