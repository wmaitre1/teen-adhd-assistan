```typescript
import React from 'react';
import { AccountSettings } from './AccountSettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import { GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Customize your app experience
        </p>
      </header>

      <div className="grid gap-6 mt-8">
        <AccountSettings />
        <AccessibilitySettings />
        <GeneralSettings />
        <NotificationSettings />
        <PrivacySettings />
      </div>
    </div>
  );
}

export default Settings;
```