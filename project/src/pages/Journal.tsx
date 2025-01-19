import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { JournalList } from '../components/journal/JournalList';
import { JournalPrompts } from '../components/journal/JournalPrompts';
import { MoodTrends } from '../components/journal/MoodTrends';
import { TagsCloud } from '../components/journal/TagsCloud';
import { JournalInsights } from '../components/journal/JournalInsights';
import { JournalEntryForm } from '../components/journal/JournalEntryForm';
import { useStore } from '../lib/store';
import type { JournalEntry } from '../types';

export function Journal() {
  const { userProgress } = useStore();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const currentDate = new Date();

  // Listen for voice commands
  useEffect(() => {
    const handleNewEntry = (event: CustomEvent) => {
      const { content } = event.detail;
      if (content) {
        setEditingEntry({
          id: crypto.randomUUID(),
          content,
          timestamp: new Date().toISOString(),
          mood: { value: 3, label: 'Neutral', emoji: '😐' },
          tags: []
        } as JournalEntry);
        setShowEntryForm(true);
      }
    };

    window.addEventListener('newJournalEntry', handleNewEntry as EventListener);
    return () => {
      window.removeEventListener('newJournalEntry', handleNewEntry as EventListener);
    };
  }, []);

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const handleCloseForm = () => {
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-900">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <button 
            onClick={() => setShowEntryForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Entries, Prompts, and Tags */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Entries</h2>
            <JournalList 
              entries={userProgress.journalEntries || []} 
              onEdit={handleEdit}
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Journal Prompt</h2>
            <JournalPrompts />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags Cloud</h2>
            <TagsCloud entries={userProgress.journalEntries || []} />
          </div>
        </div>

        {/* Right Column - Insights and Analytics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mood Trends</h2>
            <MoodTrends entries={userProgress.journalEntries || []} />
          </div>

          <JournalInsights entries={userProgress.journalEntries || []} />
        </div>
      </div>

      {showEntryForm && (
        <JournalEntryForm 
          onClose={handleCloseForm}
          initialEntry={editingEntry}
        />
      )}
    </div>
  );
}