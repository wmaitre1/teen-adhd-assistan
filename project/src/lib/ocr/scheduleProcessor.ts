import { createWorker } from 'tesseract.js';
import { parseScheduleText } from './parser';
import type { Schedule } from '../../types';

export class ScheduleProcessor {
  private static worker: Tesseract.Worker | null = null;

  private static async initWorker() {
    if (!this.worker) {
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
    }
    return this.worker;
  }

  static async processImage(file: File): Promise<Partial<Schedule>[]> {
    const worker = await this.initWorker();
    
    // Convert file to base64
    const reader = new FileReader();
    const base64Image = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    // Perform OCR
    const { data: { text } } = await worker.recognize(base64Image);
    
    // Parse the extracted text into schedule items
    const scheduleItems = parseScheduleText(text);
    
    return scheduleItems;
  }

  static async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}