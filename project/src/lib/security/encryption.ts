import { Buffer } from 'buffer';

export class Encryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  private static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string): Promise<string> {
    const key = await this.generateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encodedData
    );

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const combined = new Uint8Array(iv.length + encryptedData.byteLength + exportedKey.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    combined.set(new Uint8Array(exportedKey), iv.length + encryptedData.byteLength);

    return Buffer.from(combined).toString('base64');
  }

  static async decrypt(encryptedData: string): Promise<string> {
    const combined = Buffer.from(encryptedData, 'base64');
    const iv = combined.slice(0, this.IV_LENGTH);
    const data = combined.slice(this.IV_LENGTH, -this.KEY_LENGTH);
    const keyData = combined.slice(-this.KEY_LENGTH);

    const key = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      this.ALGORITHM,
      true,
      ['decrypt']
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedData);
  }
}