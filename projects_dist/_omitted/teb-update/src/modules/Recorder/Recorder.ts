export abstract class Recorder {
  private static mediaRecorder: MediaRecorder;
  private static chunks: Blob[] = [];
  static get isLive() {
    return this.mediaRecorder.state === "recording";
  }
  static get isInitialized() {
    return Boolean(this.mediaRecorder);
  }
  static init(canvas: HTMLCanvasElement, fps = 60, bps = 2_500_000) {
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { videoBitsPerSecond: bps });
    recorder.onstop = (e) => this.onStop(e);
    recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.mediaRecorder = recorder;
  }
  static start() {
    if (!this.isInitialized)
      return console.warn("Recorder: not initialized yet");
    if (this.isLive) return console.debug("Recorder: already started");
    console.log("Recording started");
    this.mediaRecorder.start();
  }
  static stop() {
    if (!this.isLive) return console.debug("Recorder: nothing to stop");
    console.debug("Recorder: recording stopped");
    this.mediaRecorder.stop();
  }
  private static onStop(e: Event) {
    this.download();
    this.chunks.length = 0;
  }
  private static download() {
    if (!this.chunks.length)
      return console.debug("Recorder: no record to download");
    const blob = new Blob(this.chunks, { type: "video/mp4" });
    const videoURL = URL.createObjectURL(blob);
    const tmpAnchor = document.createElement("a");
    tmpAnchor.href = videoURL;
    tmpAnchor.setAttribute("download", Date.now().toString());
    tmpAnchor.click();
  }
}