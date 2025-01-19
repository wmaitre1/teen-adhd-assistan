import { supabase } from '../supabase';
import { Encryption } from './encryption';

export class SessionManager {
  private static readonly SESSION_KEY = 'secure_session';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  static async createSession(userId: string, role: string): Promise<void> {
    const session = {
      userId,
      role,
      created: Date.now(),
      expires: Date.now() + this.MAX_AGE
    };

    // Encrypt session data
    const encryptedSession = Encryption.encrypt(JSON.stringify(session));
    
    // Store in secure cookie
    document.cookie = `${this.SESSION_KEY}=${encryptedSession}; path=/; secure; samesite=strict; max-age=${this.MAX_AGE}`;
  }

  static async validateSession(): Promise<boolean> {
    try {
      const sessionCookie = this.getSessionCookie();
      if (!sessionCookie) return false;

      const session = JSON.parse(Encryption.decrypt(sessionCookie));
      
      // Check expiration
      if (Date.now() > session.expires) {
        this.clearSession();
        return false;
      }

      // Verify with Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user || user.id !== session.userId) {
        this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      this.clearSession();
      return false;
    }
  }

  static clearSession(): void {
    document.cookie = `${this.SESSION_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  private static getSessionCookie(): string | null {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith(`${this.SESSION_KEY}=`));
    return sessionCookie ? sessionCookie.split('=')[1] : null;
  }
}