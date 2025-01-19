import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DatabaseConnectionCheckProps {
  children: React.ReactNode;
}

export function DatabaseConnectionCheck({ children }: DatabaseConnectionCheckProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDb = async () => {
      try {
        // Use a simple query that doesn't depend on user ID
        const { error } = await supabase
          .from('points_config')
          .select('id')
          .limit(1);
        
        setIsConnected(!error);
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkDb();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to database...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Connection Error</h2>
            <p>Unable to connect to the database. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}