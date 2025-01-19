```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacySettings() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Privacy & Data</h2>
      </div>

      <div className="space-y-4">
        <Link
          to="/settings/data-export"
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium text-gray-900">Export My Data</span>
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Link>

        <Link
          to="/settings/privacy-policy"
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium text-gray-900">Privacy Policy</span>
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Link>

        <button className="w-full flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <span className="font-medium">Delete Account</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.section>
  );
}
```