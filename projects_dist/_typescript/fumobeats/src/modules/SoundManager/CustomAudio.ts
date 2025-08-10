export class CustomAudio {
  private _src: string = "";
  get src() {
    return this._src;
  }
  set src(src: string) {
    for (const instance of this.instances) {
      instance.original.src = src;
    }
    this._src = src;
  }
  instances: AudioInstance[] = [];
  calledPlayPromise = false;
  private volumeModifier = 1;
  private speedModifier = 1;
  audioContext: AudioContext;
  constructor(props: { src: string; audioContext: AudioContext }) {
    const { src, audioContext } = props;
    this.audioContext = audioContext;
    this.instances.push(
      new AudioInstance({
        src,
        id: "default",
        volumeModifier: this.volumeModifier,
        speedModifier: this.speedModifier,
        audioContext,
        pan: 0,
      })
    );
    this.src = src;
  }
  destroy() {
    for (const instance of this.instances) {
      instance.destroy();
    }
    this.instances.length = 0;
  }
  private getFreeInstance(id: string, resettable: boolean) {
    for (const instance of this.instances) {
      if (instance.audioId !== id) continue;
      if (instance.original.paused) return instance;
      if (resettable) return instance;
    }
    const newInstance = new AudioInstance({
      src: this.src,
      id,
      volumeModifier: this.volumeModifier,
      speedModifier: this.speedModifier,
      audioContext: this.audioContext,
      pan: 0,
    });
    this.instances.push(newInstance);
    return newInstance;
  }
  play({
    id = "default",
    resettable = true,
    volume = 1,
    speed = 1,
    pan = 0,
    loop = false,
  } = {}) {
    const audio = this.getFreeInstance(id, resettable);
    return audio.playInstance(volume, speed, loop, pan);
  }
  setVolumeModifier(volumeModifier: number) {
    this.volumeModifier = volumeModifier;
    for (const instance of this.instances) {
      instance.volumeModifier = volumeModifier;
    }
  }
  setSpeedModifier(speedModifier: number) {
    this.speedModifier = speedModifier;
    for (const instance of this.instances) {
      instance.speedModifier = speedModifier;
    }
  }
}

export class AudioInstance {
  audioId: string;
  original: HTMLAudioElement;
  private panNode: StereoPannerNode;
  private audioNode: AudioNode;
  get pan() {
    return this.panNode.pan.value;
  }
  set pan(_value: number) {
    let value = _value;
    if (value > this.panNode.pan.maxValue) value = this.panNode.pan.maxValue;
    if (value < this.panNode.pan.minValue) value = this.panNode.pan.minValue;
    this.panNode.pan.value = value;
  }
  private _volume: number = 1;
  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    this._volume = value;
    this.original.volume = this.volume * this.volumeModifier;
  }
  private _volumeModifier: number = 1;
  get volumeModifier() {
    return this._volumeModifier;
  }
  set volumeModifier(value: number) {
    this._volumeModifier = value;
    this.original.volume = this.volume * this.volumeModifier;
  }
  private _speed: number = 1;
  get speed() {
    return this._speed;
  }
  set speed(value: number) {
    this._speed = value;
    this.original.playbackRate = this.speed * this.speedModifier;
  }
  private _speedModifier: number = 1;
  get speedModifier() {
    return this._speedModifier;
  }
  set speedModifier(value: number) {
    this._speedModifier = value;
    this.original.playbackRate = this.speed * this.speedModifier;
  }
  constructor(props: {
    audioContext: AudioContext;
    src: string;
    id: string;
    volumeModifier: number;
    speedModifier: number;
    pan: number;
  }) {
    const { src, id, volumeModifier, speedModifier, pan, audioContext } = props;
    this.original = new Audio(src);
    this.panNode = new StereoPannerNode(audioContext, { pan });
    this.audioNode = audioContext
      .createMediaElementSource(this.original)
      .connect(this.panNode)
      .connect(audioContext.destination);

    this.volumeModifier = volumeModifier;
    this.speedModifier = speedModifier;
    this.audioId = id;
  }
  playInstance(volume: number, speed: number, loop: boolean, pan: number) {
    this.volume = volume;
    this.speed = speed;
    this.pan = pan;
    this.original.currentTime = 0;
    this.original.loop = loop;
    this.original.play().catch((error) => {
      console.warn(error);
    });
    return this;
  }
  destroy() {
    this.original.pause();
    this.panNode.disconnect();
    this.audioNode.disconnect();
    this.original.remove();
  }
}
