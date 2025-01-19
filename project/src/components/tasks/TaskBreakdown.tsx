import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus, Brain, Timer, ArrowRight, Sparkles } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import type { Task, SubTask } from '../../types';

interface TaskBreakdownProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskBreakdown({ task, onUpdate }: TaskBreakdownProps) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [showAIHelp, setShowAIHelp] = useState(false);
  const { generateSubtasks, loading: aiLoading } = useAI();

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;

    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title: newStepTitle,
      completed: false,
      difficulty: 'medium',
      estimatedMinutes: 15,
    };

    onUpdate(task.id, {
      subtasks: [...(task.subtasks || []), newSubtask],
    });

    setNewStepTitle('');
    setIsAddingStep(false);
  };

  const handleToggleStep = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const handleAIBreakdown = async () => {
    try {
      const suggestedSubtasks = await generateSubtasks(task.title, task.description);
      onUpdate(task.id, { subtasks: suggestedSubtasks });
      setShowAIHelp(false);
    } catch (error) {
      console.error('Failed to generate subtasks:', error);
    }
  };

  const calculateProgress = () => {
    if (!task.subtasks?.length) return 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return (completed / task.subtasks.length) * 100;
  };

  const totalEstimatedTime = task.subtasks?.reduce(
    (acc, st) => acc + st.estimatedMinutes,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Task Breakdown</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAIHelp(true)}
            className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
          >
            <Brain className="h-4 w-4" />
            <span>AI Help</span>
          </button>
          <button
            onClick={() => setIsAddingStep(true)}
            className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{Math.round(calculateProgress())}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Time Estimate */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Timer className="h-4 w-4" />
        <span>Estimated time: {totalEstimatedTime} minutes</span>
      </div>

      {/* Subtasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {task.subtasks?.map((subtask) => (
            <motion.div
              key={subtask.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm"
            >
              <button
                onClick={() => handleToggleStep(subtask.id)}
                className={`p-1 rounded-full transition-colors ${
                  subtask.completed
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-400 hover:text-primary hover:bg-primary/10'
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    subtask.completed ? 'text-gray-400 line-through' : ''
                  }`}
                >
                  {subtask.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      getDifficultyColor(subtask.difficulty)
                    }`}
                  >
                    {subtask.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {subtask.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Step Form */}
        <AnimatePresence>
          {isAddingStep && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-lg shadow-sm space-y-3"
            >
              <input
                type="text"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="What's the next step?"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddingStep(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStep}
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Add Step
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Help Modal */}
      <AnimatePresence>
        {showAIHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full space-y-4"
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">AI Task Breakdown</h3>
              </div>
              <p className="text-gray-600">
                Let AI help you break down this task into manageable steps. It will:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Suggest logical subtasks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Estimate time for each step</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Assess difficulty levels</span>
                </li>
              </ul>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAIHelp(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAIBreakdown}
                  disabled={aiLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {aiLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Steps</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}