interface ConsentOptions {
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

export class ConsentManager {
  private static readonly CONSENT_KEY = 'user_consent';
  private static readonly PARENT_CONSENT_KEY = 'parent_consent';

  static getConsent(): ConsentOptions {
    const stored = localStorage.getItem(this.CONSENT_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          analytics: false,
          marketing: false,
          thirdParty: false,
        };
  }

  static setConsent(options: Partial<ConsentOptions>) {
    const current = this.getConsent();
    const updated = { ...current, ...options };
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify(updated));
    return updated;
  }

  static hasParentalConsent(): boolean {
    return localStorage.getItem(this.PARENT_CONSENT_KEY) === 'true';
  }

  static setParentalConsent(granted: boolean) {
    localStorage.setItem(this.PARENT_CONSENT_KEY, String(granted));
  }

  static clearAllConsent() {
    localStorage.removeItem(this.CONSENT_KEY);
    localStorage.removeItem(this.PARENT_CONSENT_KEY);
  }
}