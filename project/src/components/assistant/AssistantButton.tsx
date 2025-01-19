import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { AssistantManager } from '@/lib/assistant/assistantManager';
import type { Message } from '@/lib/assistant/types';

interface AssistantButtonProps {
  className?: string;
}

export function AssistantButton({ className = '' }: AssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useStore();
  const assistant = AssistantManager.getInstance();

  useEffect(() => {
    if (isOpen && user) {
      assistant.initializeAssistant(user)
        .then(() => assistant.startConversation())
        .catch(error => {
          console.error('Failed to initialize assistant:', error);
        });
    }
  }, [isOpen, user]);

  const handleOpen = () => {
    if (!user) {
      console.error('User must be logged in to use assistant');
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
    setFiles([]);
    assistant.clearConversation();
  };

  const handleSendMessage = async (content: string) => {
    try {
      setIsProcessing(true);
      const response = await assistant.sendMessage(content, files);
      setMessages(prev => [...prev, 
        { role: 'user', content },
        { role: 'assistant', content: response }
      ]);
      setFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        className="relative"
        title="Open AI Assistant"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 h-[60vh] overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'assistant' ? 'text-primary' : ''
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.role === 'assistant' ? 'Eleanor' : 'You'}:
                    </p>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
                {isProcessing && (
                  <div className="text-sm text-gray-500">Eleanor is typing...</div>
                )}
              </div>

              <div className="p-4 border-t">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="mb-2"
                />
                <textarea
                  placeholder="Type your message..."
                  className="w-full p-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const content = e.currentTarget.value.trim();
                      if (content) {
                        handleSendMessage(content);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}