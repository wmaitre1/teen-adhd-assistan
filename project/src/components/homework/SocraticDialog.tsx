import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, MessageCircle } from 'lucide-react';
import { useSocraticLearning } from '../../hooks/useSocraticLearning';

interface SocraticDialogProps {
  subject: string;
  topic: string;
  onClose: () => void;
}

export function SocraticDialog({ subject, topic, onClose }: SocraticDialogProps) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const { startSession, submitResponse, currentQuestion, loading } = useSocraticLearning();

  React.useEffect(() => {
    startSession(subject, topic);
  }, [subject, topic, startSession]);

  const handleSubmit = async () => {
    if (!response.trim()) return;

    const result = await submitResponse(response);
    setFeedback(result.feedback);
    setResponse('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Socratic Learning</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {currentQuestion && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{currentQuestion.question}</p>
                </div>
              )}

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 p-4 rounded-lg"
                >
                  <p className="text-gray-900">{feedback}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                  rows={4}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!response.trim() || loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Submit Response</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}