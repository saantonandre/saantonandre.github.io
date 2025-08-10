export const parrot = async () => {
  // common variables
  let speechStart = Date.now();
  // start browser apis
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioContext = new AudioContext();
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  // Handle speech recognition
  const TOLERANCE_MS = 200;
  recognition.onspeechstart = () => {
    // console.log("speechstart");
    speechStart = Date.now() - TOLERANCE_MS;
  };
  recognition.onend = recognition.start; // Restart on abrupt ends
  // handle recorder
  const audioChunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };
  recognition.onresult = async (e) => {
    const value = e.results[0][0].transcript.trim();
    console.log(`[${e.results[0][0].confidence.toFixed(2)}]: ${value}`);
    const stopPromise = new Promise((res) => (mediaRecorder.onstop = res));
    await new Promise((res) => setTimeout(res, TOLERANCE_MS));
    const speechEndOffset = Date.now() - speechStart;
    mediaRecorder.stop();
    await stopPromise;
    mediaRecorder.start();
    // Audio trimming
    const arrayBuffer = await new Blob([...audioChunks]).arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const startSample = Math.max(
      audioBuffer.duration * audioBuffer.sampleRate -
        (speechEndOffset / 1000) * audioBuffer.sampleRate,
      0
    );
    // console.log("speechEndOffset s", speechEndOffset / 1000);
    // console.log("audioDuration s", audioBuffer.duration);
    const trimmedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      (speechEndOffset / 1000) * audioBuffer.sampleRate,
      audioBuffer.sampleRate
    );
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      trimmedBuffer.copyToChannel(
        audioBuffer.getChannelData(channel).subarray(startSample),
        channel
      );
    }
    const source = audioContext.createBufferSource();
    source.buffer = trimmedBuffer;
    source.connect(audioContext.destination);
    source.start();

    audioChunks.length = 0;
  };
  // Start services
  recognition.start();
  mediaRecorder.start();
};
