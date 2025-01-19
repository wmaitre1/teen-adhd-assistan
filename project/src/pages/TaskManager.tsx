import React, { useState, useEffect } from 'react';
import {
  Plus,
  List,
  Calendar as CalendarIcon,
  Filter,
  Mic,
  Brain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useStore } from '../lib/store';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useAI } from '../hooks/useAI';
import type { Task } from '../types';

export function TaskManager() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const { startRecording, isRecording } = useVoiceCommands();
  const { analyzeTask } = useAI();

  // Listen for voice commands to add tasks
  useEffect(() => {
    const handleVoiceTask = (event: CustomEvent) => {
      const { description } = event.detail;
      if (description) {
        setShowTaskForm(true);
        setEditingTask({
          id: '',
          title: description,
          description: '',
          dueDate: new Date().toISOString(),
          completed: false,
          priority: 'medium',
          tags: []
        });
      }
    };

    window.addEventListener('addTask', handleVoiceTask as EventListener);
    return () => {
      window.removeEventListener('addTask', handleVoiceTask as EventListener);
    };
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleTaskComplete = (id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskDelete = (task: Task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskReorder = (reorderedTasks: Task[]) => {
    reorderedTasks.forEach((task, index) => {
      updateTask(task.id, { order: index });
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <p className="text-gray-600 mt-2">
          Organize and track your tasks efficiently
        </p>
      </header>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'calendar'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => setShowTaskForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
          className="rounded-lg border-gray-300 text-gray-900"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => startRecording()}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isRecording
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mic className="h-5 w-5" />
          <span>{isRecording ? 'Recording...' : 'Add by Voice'}</span>
        </button>
      </div>

      <TaskList
        tasks={filteredTasks}
        onReorder={handleTaskReorder}
        onComplete={handleTaskComplete}
        onEdit={handleTaskEdit}
        onDelete={handleTaskDelete}
      />

      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            onSubmit={handleTaskSubmit}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            initialData={editingTask}
          />
        )}

        {taskToDelete && (
          <ConfirmDialog
            title="Delete Task"
            message={`Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`}
            confirmLabel="Delete"
            isDestructive
            onConfirm={confirmDelete}
            onCancel={() => setTaskToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}