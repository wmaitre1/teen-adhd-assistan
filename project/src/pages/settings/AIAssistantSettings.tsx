import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Lock, Bot } from 'lucide-react';
import { useSettingsStore } from '../../lib/store/settingsStore';

export function AIAssistantSettings() {
  const {
    aiAssistant,
    updateAIAssistant,
    updateAIDataCollection,
    updateAIPrivacy,
    updateParentalControls
  } = useSettingsStore();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-lg space-y-8"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Bot className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant Settings</h2>
      </div>

      {/* Main Assistant Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-medium">Enable AI Assistant</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={aiAssistant.enabled}
              onChange={(e) => updateAIAssistant({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Anonymous Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">Anonymous Mode</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={aiAssistant.anonymousMode}
              onChange={(e) => updateAIAssistant({ anonymousMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Data Collection Settings */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>Data Collection</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(aiAssistant.dataCollection).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateAIDataCollection({ [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Preferences */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium flex items-center space-x-2">
          <Lock className="h-5 w-5 text-primary" />
          <span>Privacy Preferences</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Allow Personalization</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiAssistant.privacyPreferences.allowPersonalization}
                onChange={(e) => updateAIPrivacy({ allowPersonalization: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span>Share Anonymous Data</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiAssistant.privacyPreferences.shareAnonymousData}
                onChange={(e) => updateAIPrivacy({ shareAnonymousData: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Data Retention Period</label>
            <select
              value={aiAssistant.privacyPreferences.retentionPeriod}
              onChange={(e) => updateAIPrivacy({ retentionPeriod: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parental Controls */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Parental Controls</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Enable Parental Controls</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiAssistant.parentalControls.enabled}
                onChange={(e) => updateParentalControls({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {aiAssistant.parentalControls.enabled && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Supervision Level</label>
                <select
                  value={aiAssistant.parentalControls.supervisionLevel}
                  onChange={(e) => updateParentalControls({ supervisionLevel: e.target.value as 'none' | 'moderate' | 'strict' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="none">None</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Restricted Features</label>
                <div className="space-y-2">
                  {['Personal Data Sharing', 'External Links', 'Chat History', 'File Uploads'].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={aiAssistant.parentalControls.restrictedFeatures.includes(feature)}
                        onChange={(e) => {
                          const features = e.target.checked
                            ? [...aiAssistant.parentalControls.restrictedFeatures, feature]
                            : aiAssistant.parentalControls.restrictedFeatures.filter(f => f !== feature);
                          updateParentalControls({ restrictedFeatures: features });
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-sm text-gray-500">
        <p>These settings control how the AI Assistant collects and uses your data to provide personalized assistance. You can adjust these settings at any time.</p>
        <p className="mt-2">When Anonymous Mode is enabled, the AI Assistant will still help you but won't store or use your data for personalization.</p>
      </div>
    </motion.section>
  );
} 