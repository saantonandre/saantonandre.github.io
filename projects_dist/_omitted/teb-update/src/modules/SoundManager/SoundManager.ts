import { CustomAudio } from "./CustomAudio";

const audioContext = {
  value: undefined as undefined | AudioContext,
};
export const getAudioContext = () => {
  if (audioContext.value) return audioContext.value;
  audioContext.value = new AudioContext();
  return audioContext.value;
};
export class SoundManager<T extends Record<K, string>, K extends keyof T> {
  /** List of audio entities names */
  audioContext: AudioContext;
  private _volume: number = 1;
  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    this._volume = value;
    this.setGlobalVolume(value);
  }
  private _speed: number = 1;
  get speed() {
    return this._speed;
  }
  set speed(value: number) {
    this._speed = value;
    this.setGlobalSpeed(value);
  }
  /** Record of audio entities names and corresponding Audio */
  private soundsMap: Record<K, CustomAudio>;
  private soundsList: K[];
  /** Record of audio entities names and corresponding Audio */
  private customSoundsMap: Record<string, CustomAudio> = {};
  private customSoundsList: string[] = [];
  /**
   *Instantiates and manages audio entities.
   * @param records A record of arbitrary names (`string`) -> source URI (`string`)
   */
  constructor(records: T, volume: number) {
    this.audioContext = getAudioContext();
    this.soundsList = getObjectKeys(records);
    const soundsEntries = this.soundsList.map(
      (key) =>
        [
          key,
          new CustomAudio({
            src: records[key],
            audioContext: this.audioContext,
          }),
        ] satisfies [K, CustomAudio]
    );
    this.soundsMap = toObject(soundsEntries);
    this.volume = volume;
  }
  play(sound: K, ...args: Parameters<CustomAudio["play"]>) {
    const instance = this.soundsMap[sound].play(...args);
    return instance;
  }
  playRandom(list: K[], ...args: Parameters<CustomAudio["play"]>) {
    const index = Math.floor(Math.random() * list.length);
    const instance = this.soundsMap[list[index]].play(...args);
    return instance;
  }
  /** Plays a custom sound. Throws an error if it doesn't exist */
  playCustom(sound: string, ...args: Parameters<CustomAudio["play"]>) {
    const instance = this.customSoundsMap[sound].play(...args);
    return instance;
  }
  addCustom(sound: string, file: File) {
    const customAudio = new CustomAudio({
      src: URL.createObjectURL(file),
      audioContext: this.audioContext,
    });
    if (this.customSoundsMap[sound]) {
      this.destroyCustomAudio(sound);
    }
    this.customSoundsMap[sound] = customAudio;
    this.customSoundsList.push(sound);
    return customAudio;
  }
  destroyCustomAudio(sound: string) {
    if (!this.customSoundsMap[sound]) return console.log("No song to destroy");
    this.customSoundsMap[sound].destroy();
    delete this.customSoundsMap[sound];
    this.customSoundsList.splice(this.customSoundsList.indexOf(sound), 1);
  }
  private setGlobalVolume(globalVolume: number) {
    for (const soundName of this.soundsList) {
      this.soundsMap[soundName].setVolumeModifier(globalVolume);
    }
    for (const soundName of this.customSoundsList) {
      this.customSoundsMap[soundName].setVolumeModifier(globalVolume);
    }
  }
  private setGlobalSpeed(globalSpeed: number) {
    for (const soundName of this.soundsList) {
      this.soundsMap[soundName].setSpeedModifier(globalSpeed);
    }
    for (const soundName of this.customSoundsList) {
      this.customSoundsMap[soundName].setSpeedModifier(globalSpeed);
    }
  }
}

function toObject<K extends string | symbol | number, V>(entries: [K, V][]) {
  return Object.fromEntries(entries) as Record<K, V>;
}
function getObjectKeys<T extends Record<K, any>, K extends keyof T>(obj: T) {
  return Object.keys(obj) as K[];
}
