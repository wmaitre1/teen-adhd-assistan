import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, Mic } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { useAssistant } from '../../hooks/useAssistant';
import { SafeContentInput } from '../shared/SafeContentInput';
import { VoiceRecorder } from '../voice/VoiceRecorder';
import { ImageUploader } from '../vision/ImageUploader';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useStore();
  const { sendMessage, loading } = useAssistant();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const response = await sendMessage(content, {
        page: location.pathname,
        userRole: user?.role,
      });

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async (text: string) => {
    setShowVoiceRecorder(false);
    await handleSendMessage(text);
  };

  const handleImageUpload = async (result: any) => {
    setShowImageUploader(false);
    if (result.text) {
      await handleSendMessage(`Image analysis: ${result.text}`);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-gray-100'
                  : 'bg-primary text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showVoiceRecorder && (
        <div className="p-4 border-t">
          <VoiceRecorder
            onTranscription={handleVoiceInput}
            maxDuration={10000}
          />
        </div>
      )}

      {showImageUploader && (
        <div className="p-4 border-t">
          <ImageUploader
            onUpload={handleImageUpload}
            type="text"
            maxSize={5 * 1024 * 1024}
          />
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowVoiceRecorder(true)}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowImageUploader(true)}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <SafeContentInput
            onSubmit={handleSendMessage}
            placeholder="Type your message..."
            maxLength={500}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}