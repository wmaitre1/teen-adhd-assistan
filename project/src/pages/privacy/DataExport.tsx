import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, FileJson, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

export function DataExport() {
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const store = useStore();

  const handleExport = async () => {
    setExporting(true);
    try {
      // Prepare data for export
      const exportData = {
        tasks: store.tasks,
        assignments: store.assignments,
        grades: store.grades,
        userProgress: store.userProgress,
        exerciseFeedback: store.exerciseFeedback,
        timestamp: new Date().toISOString(),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adhd-assist-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Settings</span>
      </button>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Export Your Data</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-medium mb-2">What's included in your export?</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <FileJson className="h-4 w-4" />
                <span>Tasks and assignments</span>
              </li>
              <li className="flex items-center space-x-2">
                <FileJson className="h-4 w-4" />
                <span>Progress and achievements</span>
              </li>
              <li className="flex items-center space-x-2">
                <FileJson className="h-4 w-4" />
                <span>Exercise feedback and mood tracking</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <motion.button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-5 w-5" />
              <span>{exporting ? 'Preparing Export...' : 'Download My Data'}</span>
            </motion.button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Your data will be exported as a JSON file that you can save to your device.
          </p>
        </div>
      </div>
    </div>
  );
}