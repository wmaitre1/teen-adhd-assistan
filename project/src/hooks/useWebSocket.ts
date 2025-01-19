import { useEffect, useCallback } from 'react';
import { WebSocketClient } from '../lib/api/websocket';

const wsClient = new WebSocketClient();

export function useWebSocket(type: string, callback: (data: any) => void) {
  useEffect(() => {
    const unsubscribe = wsClient.subscribe(type, callback);
    return () => unsubscribe();
  }, [type, callback]);

  const send = useCallback(
    (data: any) => {
      wsClient.send(type, data);
    },
    [type]
  );

  return { send };
}