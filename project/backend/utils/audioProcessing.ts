import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import { Buffer } from 'buffer';

const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB chunks
const MAX_DURATION = 30; // 30 seconds per chunk

export async function optimizeAudio(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputStream = new Readable();
    inputStream.push(buffer);
    inputStream.push(null);

    const chunks: Buffer[] = [];

    ffmpeg(inputStream)
      .toFormat('wav')
      .audioChannels(1)
      .audioFrequency(16000)
      .on('error', reject)
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => {
        resolve(Buffer.concat(chunks));
      });
  });
}

export async function processAudioChunk(buffer: Buffer): Promise<Buffer[]> {
  const chunks: Buffer[] = [];
  
  // If file is smaller than chunk size, return as is
  if (buffer.length <= CHUNK_SIZE) {
    chunks.push(buffer);
    return chunks;
  }

  // Split into chunks
  return new Promise((resolve, reject) => {
    const inputStream = new Readable();
    inputStream.push(buffer);
    inputStream.push(null);

    let currentChunk: Buffer[] = [];
    let currentDuration = 0;

    ffmpeg(inputStream)
      .toFormat('wav')
      .audioChannels(1)
      .audioFrequency(16000)
      .on('error', reject)
      .on('data', (chunk) => {
        currentChunk.push(chunk);
        
        // Calculate approximate duration
        const chunkDuration = (chunk.length / (16000 * 2)); // 16-bit samples
        currentDuration += chunkDuration;

        if (currentDuration >= MAX_DURATION) {
          chunks.push(Buffer.concat(currentChunk));
          currentChunk = [];
          currentDuration = 0;
        }
      })
      .on('end', () => {
        if (currentChunk.length > 0) {
          chunks.push(Buffer.concat(currentChunk));
        }
        resolve(chunks);
      });
  });
}

export function calculateAudioDuration(buffer: Buffer): number {
  // For 16-bit, 16kHz mono audio
  return buffer.length / (16000 * 2);
}