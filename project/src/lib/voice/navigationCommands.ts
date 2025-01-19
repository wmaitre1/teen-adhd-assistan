import type { NavigationCommands } from './types';

export const navigationCommands: NavigationCommands = {
  HOME: {
    routeName: 'Home',
    route: '/',
    aliases: ['home', 'main', 'dashboard', 'start']
  },
  TASKS: {
    routeName: 'Tasks',
    route: '/tasks',
    aliases: ['tasks', 'todo', 'to do', 'task list']
  },
  HOMEWORK: {
    routeName: 'Homework',
    route: '/homework',
    aliases: ['homework', 'assignments', 'school work']
  },
  JOURNAL: {
    routeName: 'Journal',
    route: '/journal',
    aliases: ['journal', 'diary', 'notes']
  },
  MINDFULNESS: {
    routeName: 'Mindfulness',
    route: '/mindfulness',
    aliases: ['mindfulness', 'meditation', 'breathing', 'relax']
  },
  PROGRESS: {
    routeName: 'Progress',
    route: '/progress',
    aliases: ['progress', 'stats', 'achievements', 'tracking']
  },
  SETTINGS: {
    routeName: 'Settings',
    route: '/settings',
    aliases: ['settings', 'preferences', 'options', 'config']
  },
  PROFILE: {
    routeName: 'Profile',
    route: '/profile',
    aliases: ['profile', 'account', 'my account']
  }
};