import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Mic, Brain, Tag as TagIcon } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useAI } from '../../hooks/useAI';
import type { JournalEntry } from '../../types';

interface JournalEntryFormProps {
  onClose: () => void;
  initialEntry?: JournalEntry | null;
}

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 5 },
  { emoji: '😌', label: 'Calm', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😕', label: 'Worried', value: 2 },
  { emoji: '😢', label: 'Sad', value: 1 },
];

export function JournalEntryForm({ onClose, initialEntry }: JournalEntryFormProps) {
  const [content, setContent] = useState(initialEntry?.content || '');
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(
    initialEntry ? MOODS.find(m => m.label === initialEntry.mood.label) || null : null
  );
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { generateJournalPrompt } = useAI();
  const { addJournalEntry, updateJournalEntry } = useStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleSubmit = () => {
    if (!selectedMood || !content.trim()) return;

    const entryData = {
      content,
      mood: selectedMood,
      tags,
      timestamp: new Date().toISOString(),
      ...(image && { attachments: [{ type: 'image' as const, url: URL.createObjectURL(image) }] })
    };

    if (initialEntry) {
      updateJournalEntry(initialEntry.id, entryData);
    } else {
      addJournalEntry(entryData);
    }

    onClose();
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
            <h2 className="text-2xl font-semibold text-gray-900">
              {initialEntry ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">How are you feeling today?</h3>
            <div className="flex justify-center space-x-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-4 rounded-lg transition-colors ${
                    selectedMood?.label === mood.label
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <p className="mt-1 text-sm text-gray-900">{mood.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Entry Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Write your entry</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Add image"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording ? 'text-red-500 bg-red-50' : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Voice input"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowAIHelp(true)}
                  className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Get AI help"
                >
                  <Brain className="h-5 w-5" />
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing here..."
              className="w-full h-48 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 text-gray-900 placeholder-gray-500"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                  placeholder="Add tags..."
                  className="w-full pl-10 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 text-gray-900 placeholder-gray-500"
                />
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleTagAdd}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-900"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedMood || !content.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialEntry ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}