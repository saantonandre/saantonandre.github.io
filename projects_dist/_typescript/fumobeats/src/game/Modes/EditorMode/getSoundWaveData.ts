export async function getSoundWaveData(
  audioCtx: AudioContext,
  audioFile: File,
  sampleSize = 100
) {
  const arrayBuffer = await audioFile.arrayBuffer();
  
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const normalizedData = normalizeData(audioBuffer, sampleSize);
  return normalizedData;
}

/** Returns a Float32Array representing the audio buffer as a mono buffer (sampled) */
function normalizeData(audioBuffer: AudioBuffer, sampleSize: number = 60) {
  const channelsData: Float32Array[] = [];
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channelsData.push(audioBuffer.getChannelData(i));
  }
  const sampledData: number[] = [];
  const sampleRate = Math.floor(audioBuffer.sampleRate / sampleSize);
  // Sampling, averaging, normalizing
  let min: number = Infinity;
  let max: number = -Infinity;
  for (let i = 0; i < channelsData[0].length; i += sampleRate) {
    let sum = 0;
    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      for (let j = i; j < i + sampleRate; j++) {
        sum += channelsData[c][j];
      }
    }
    const value = sum / audioBuffer.numberOfChannels / sampleRate;
    if (value > max) max = value;
    if (value < min) min = value;
    sampledData.push(value);
  }
  const res= new Float32Array(sampledData.map((v) => (v - min) / (max - min) -0.5));
  return res
}
