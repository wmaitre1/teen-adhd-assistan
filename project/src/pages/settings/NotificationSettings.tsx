```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock } from 'lucide-react';
import { useSettingsStore } from '../../lib/store/settingsStore';

export function NotificationSettings() {
  const { notifications, updateNotifications } = useSettingsStore();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
      </div>

      <div className="space-y-6">
        {/* Task Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Task Reminders</p>
            <p className="text-sm text-gray-600">Get notified about upcoming tasks</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.taskReminders}
              onChange={() => updateNotifications({ taskReminders: !notifications.taskReminders })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Daily Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Daily Summary</p>
            <p className="text-sm text-gray-600">Receive a daily overview</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.dailySummary}
              onChange={() => updateNotifications({ dailySummary: !notifications.dailySummary })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Quiet Hours</p>
                <p className="text-sm text-gray-600">Mute notifications during specific hours</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.quietHours.enabled}
                onChange={() => updateNotifications({
                  quietHours: {
                    ...notifications.quietHours,
                    enabled: !notifications.quietHours.enabled,
                  },
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {notifications.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 pl-8">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                <input
                  type="time"
                  value={notifications.quietHours.start}
                  onChange={(e) =>
                    updateNotifications({
                      quietHours: {
                        ...notifications.quietHours,
                        start: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border-gray-300 text-gray-900 focus:border-primary focus:ring focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Time</label>
                <input
                  type="time"
                  value={notifications.quietHours.end}
                  onChange={(e) =>
                    updateNotifications({
                      quietHours: {
                        ...notifications.quietHours,
                        end: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border-gray-300 text-gray-900 focus:border-primary focus:ring focus:ring-primary/20"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
```