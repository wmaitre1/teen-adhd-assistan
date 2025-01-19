import { OpenAIError, API_BASE_URL } from '../openai';

export interface BatchJob {
  id: string;
  type: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export async function processBatch(jobs: BatchJob[]): Promise<BatchJob[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobs }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Batch processing failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    throw new OpenAIError('Failed to process batch: ' + error.message, error);
  }
}

export async function checkBatchStatus(jobIds: string[]): Promise<BatchJob[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/batch/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobIds }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to check batch status: ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    throw new OpenAIError('Failed to check batch status: ' + error.message, error);
  }
}