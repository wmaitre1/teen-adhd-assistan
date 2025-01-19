```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Lock } from 'lucide-react';

export function AccountSettings() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=random"
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <button className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <button className="text-primary">Change Picture</button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Name
          </label>
          <input
            type="text"
            defaultValue="John Doe"
            className="w-full rounded-lg border-gray-300 text-gray-900 focus:border-primary focus:ring focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Email
          </label>
          <input
            type="email"
            defaultValue="john@example.com"
            className="w-full rounded-lg border-gray-300 text-gray-900 focus:border-primary focus:ring focus:ring-primary/20"
          />
        </div>

        <button className="flex items-center space-x-2 text-primary">
          <Lock className="h-4 w-4" />
          <span>Change Password</span>
        </button>

        <button className="w-full btn-primary">
          Save Changes
        </button>
      </div>
    </motion.section>
  );
}
```