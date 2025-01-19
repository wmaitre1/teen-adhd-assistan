import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { HomeworkCard } from './HomeworkCard';
import { HomeworkForm } from './HomeworkForm';
import { HomeworkCalendar } from './HomeworkCalendar';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { HomeworkAssignment } from '../../types';

interface HomeworkTrackerProps {
  assignments: HomeworkAssignment[];
  onAddAssignment: (assignment: HomeworkAssignment) => void;
  onCompleteAssignment: (id: string) => void;
  onUpdateAssignment?: (id: string, updates: Partial<HomeworkAssignment>) => void;
  onDeleteAssignment?: (id: string) => void;
}

export function HomeworkTracker({
  assignments,
  onAddAssignment,
  onCompleteAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}: HomeworkTrackerProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<HomeworkAssignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<HomeworkAssignment | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Homework Tracker</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-md transition-colors ${view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              aria-label="Calendar view"
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {assignments.map((assignment) => (
              <HomeworkCard
                key={assignment.id}
                assignment={assignment}
                onComplete={onCompleteAssignment}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <HomeworkCalendar
              assignments={assignments}
              onComplete={onCompleteAssignment}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <HomeworkForm
            onSubmit={(data) => {
              if (editingAssignment && onUpdateAssignment) {
                onUpdateAssignment(editingAssignment.id, data);
              } else {
                onAddAssignment(data as HomeworkAssignment);
              }
              setShowForm(false);
              setEditingAssignment(null);
            }}
            onClose={() => {
              setShowForm(false);
              setEditingAssignment(null);
            }}
            initialData={editingAssignment}
          />
        )}

        {assignmentToDelete && onDeleteAssignment && (
          <ConfirmDialog
            title="Delete Assignment"
            message={`Are you sure you want to delete "${assignmentToDelete.title}"? This action cannot be undone.`}
            confirmLabel="Delete"
            isDestructive
            onConfirm={() => {
              onDeleteAssignment(assignmentToDelete.id);
              setAssignmentToDelete(null);
            }}
            onCancel={() => setAssignmentToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}