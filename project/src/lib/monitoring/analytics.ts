import mixpanel from 'mixpanel-browser';

class Analytics {
  private initialized = false;

  init() {
    if (import.meta.env.PROD && !this.initialized) {
      mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN);
      this.initialized = true;
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (this.initialized) {
      mixpanel.identify(userId);
      if (traits) {
        mixpanel.people.set(traits);
      }
    }
  }

  track(event: string, properties?: Record<string, any>) {
    if (this.initialized) {
      mixpanel.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  }

  page(name: string, properties?: Record<string, any>) {
    if (this.initialized) {
      mixpanel.track('Page View', {
        page: name,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const analytics = new Analytics();