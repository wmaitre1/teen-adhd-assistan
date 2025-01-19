import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Brain, AlertTriangle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 5, color: 'bg-green-100 text-green-800' },
  { emoji: '😌', label: 'Calm', value: 4, color: 'bg-blue-100 text-blue-800' },
  { emoji: '😐', label: 'Neutral', value: 3, color: 'bg-gray-100 text-gray-800' },
  { emoji: '😕', label: 'Worried', value: 2, color: 'bg-yellow-100 text-yellow-800' },
  { emoji: '😢', label: 'Sad', value: 1, color: 'bg-red-100 text-red-800' },
];

interface MoodEntry {
  id: string;
  mood: typeof MOODS[number];
  note: string;
  timestamp: Date;
}

export function MoodTracker() {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number] | null>(null);
  const [note, setNote] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const handleMoodSubmit = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: selectedMood,
      note,
      timestamp: new Date(),
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setSelectedMood(null);
    setNote('');
    setShowMoodSelector(false);

    // Check for concerning patterns
    const recentEntries = [...moodEntries, newEntry].slice(0, 7);
    const averageMood = recentEntries.reduce((acc, entry) => acc + entry.mood.value, 0) / recentEntries.length;

    if (averageMood <= 2 && recentEntries.length >= 3) {
      // Alert parent through dashboard
      console.log('Alerting parent about concerning mood pattern');
      // TODO: Implement parent notification
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Smile className="h-6 w-6 text-primary" />
          <span>Mood Tracker</span>
        </h2>
        <button
          onClick={() => setShowMoodSelector(true)}
          className="btn-primary"
        >
          Log Mood
        </button>
      </div>

      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-medium mb-4">How are you feeling?</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    selectedMood?.label === mood.label
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What's on your mind? (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  placeholder="Share your thoughts..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMoodSelector(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMoodSubmit}
                  disabled={!selectedMood}
                  className="btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {moodEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{entry.mood.emoji}</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${entry.mood.color}`}>
                    {entry.mood.label}
                  </span>
                </div>
                {entry.note && (
                  <p className="mt-2 text-gray-600">{entry.note}</p>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {format(entry.timestamp, 'MMM d, h:mm a')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}