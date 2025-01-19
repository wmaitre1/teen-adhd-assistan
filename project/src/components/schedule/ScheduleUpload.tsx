import React, { useCallback } from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';

export function ScheduleUpload() {
  const { processScheduleImage } = useSchedule();
  const [processing, setProcessing] = React.useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setProcessing(true);
      await processScheduleImage(file);
    } catch (error) {
      console.error('Failed to process schedule:', error);
    } finally {
      setProcessing(false);
    }
  }, [processScheduleImage]);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <p className="text-gray-600">
              Drag and drop your schedule here, or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, Word, Excel, and image files
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <button className="btn-primary" disabled={processing}>
            {processing ? 'Processing...' : 'Choose File'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
          <FileText className="h-5 w-5 text-primary" />
          <span>Upload Document</span>
        </button>
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
          <Image className="h-5 w-5 text-primary" />
          <span>Take Photo</span>
        </button>
      </div>
    </div>
  );
}