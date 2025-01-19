import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Share2, Star, Volume2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

export function JournalEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProgress } = useStore();
  const entry = userProgress.journalEntries?.find(e => e.id === id);

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Journal</span>
        </button>

        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Star className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {format(new Date(entry.timestamp), 'MMMM d, yyyy')}
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Volume2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <span className="text-4xl">{entry.mood.emoji}</span>
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              Feeling {entry.mood.label}
            </h2>
            <p className="text-sm text-gray-600">
              {format(new Date(entry.timestamp), 'h:mm a')}
            </p>
          </div>
        </div>

        {entry.prompt && (
          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <p className="text-primary font-medium">Prompt</p>
            <p className="mt-1 text-gray-900">{entry.prompt}</p>
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-gray-900 whitespace-pre-wrap">{entry.content}</p>
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-6 pt-6 border-t">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-900">
            This entry shows a {entry.mood.label.toLowerCase()} mood, which is {' '}
            {entry.mood.value >= 4 ? 'more positive' : entry.mood.value >= 3 ? 'neutral' : 'more challenging'} 
            than your recent average.
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Key Themes</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Emotional awareness and reflection</li>
              <li>• Personal growth and learning</li>
              <li>• Daily experiences and observations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}