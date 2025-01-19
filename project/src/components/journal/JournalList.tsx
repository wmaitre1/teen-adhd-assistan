import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Heart, Book, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import type { JournalEntry } from '../../types';
import { useStore } from '../../lib/store';

interface JournalListProps {
  entries: JournalEntry[];
  onEdit?: (entry: JournalEntry) => void;
}

export function JournalList({ entries, onEdit }: JournalListProps) {
  const { deleteJournalEntry } = useStore();

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{entry.mood.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {format(new Date(entry.timestamp), 'MMMM d, yyyy')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(entry.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>

              {entry.prompt && (
                <div className="mt-2 text-sm text-primary">
                  Prompt: {entry.prompt}
                </div>
              )}

              <p className="mt-3 text-gray-900 line-clamp-3">{entry.content}</p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center space-x-2 mt-3">
                  <Tag className="h-4 w-4 text-gray-900" />
                  <div className="flex gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-900 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit?.(entry)}
                className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit entry"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteJournalEntry(entry.id)}
                className="p-2 text-gray-900 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {entries.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto text-gray-900 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Journal Entries Yet
          </h3>
          <p className="text-gray-600">
            Start writing your first entry to track your thoughts and feelings
          </p>
        </div>
      )}
    </div>
  );
}