import React from 'react';
import { Bell, Clock, Calendar } from 'lucide-react';

export function NotificationSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-primary" />
          <span>Class Reminders</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm">1 hour before class</span>
          </div>
          <input type="checkbox" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm">15 minutes before class</span>
          </div>
          <input type="checkbox" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm">Daily schedule summary</span>
          </div>
          <input type="checkbox" />
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Notification Style
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="radio" name="notificationStyle" value="vibrate" />
            <span className="text-sm">Vibrate</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="notificationStyle" value="sound" />
            <span className="text-sm">Sound</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="notificationStyle" value="both" />
            <span className="text-sm">Both</span>
          </label>
        </div>
      </div>
    </div>
  );
}