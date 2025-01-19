import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/react';
import { client } from './lib/graphql/client';
import { initSentry } from './lib/monitoring/sentry';
import { analytics } from './lib/monitoring/analytics';
import App from './App';
import './index.css';

// Initialize monitoring and analytics
initSentry();
analytics.init();

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful');
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}

const SentryApp = Sentry.withProfiler(App);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <SentryApp />
    </ApolloProvider>
  </StrictMode>
);