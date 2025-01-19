import { motion } from 'framer-motion';
import { 
  Bell, 
  Moon, 
  Volume2, 
  Eye,
  Clock,
  Shield,
  ChevronRight,
  User,
  Camera,
  Mail,
  Lock,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../lib/store/settingsStore';

export const Settings = () => {
  const {
    theme,
    soundEnabled,
    notifications,
    accessibility: { colorBlindMode, highContrastMode },
    distractionFreeMode,
    setTheme,
    setSoundEnabled,
    updateNotifications,
    setColorBlindMode,
    setHighContrastMode,
    setDistractionFreeMode
  } = useSettingsStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-900 mt-2">
          Customize your app experience
        </p>
      </header>
      <div className="grid gap-6 mt-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Settings
          </h2>
          <div className="mt-4 space-y-4">
            <Link to="/profile" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-gray-900" />
                <span className="text-gray-900">Profile Information</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Link>
            <Link to="/email" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-900" />
                <span className="text-gray-900">Email Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Link>
            <Link to="/security" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-900" />
                <span className="text-gray-900">Security Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Link>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-gray-900">Color Blind Mode</span>
                  <span className="text-sm text-gray-600">Adjust colors for colorblind users</span>
                </div>
              </div>
              <button
                onClick={() => setColorBlindMode(!colorBlindMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  colorBlindMode ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    colorBlindMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-gray-900">High Contrast Mode</span>
                  <span className="text-sm text-gray-600">Increase contrast for better visibility</span>
                </div>
              </div>
              <button
                onClick={() => setHighContrastMode(!highContrastMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  highContrastMode ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    highContrastMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            General Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-gray-900" />
                <div className="flex flex-col">
                  <span className="text-gray-900">Theme</span>
                  <span className="text-sm text-gray-600">Choose your preferred theme</span>
                </div>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="text-sm text-gray-900 bg-transparent border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-gray-900" />
                <div className="flex flex-col">
                  <span className="text-gray-900">Sound Effects</span>
                  <span className="text-sm text-gray-600">Enable or disable sound effects</span>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  soundEnabled ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-900" />
                <div className="flex flex-col">
                  <span className="text-gray-900">Distraction Free Mode</span>
                  <span className="text-sm text-gray-600">Hide non-essential elements</span>
                </div>
              </div>
              <button
                onClick={() => setDistractionFreeMode(!distractionFreeMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  distractionFreeMode ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    distractionFreeMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </h2>
          <div className="mt-4 space-y-4">
            {Object.entries(notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</span>
                    <span className="text-sm text-gray-600">Receive notifications for {key}</span>
                  </div>
                </div>
                <button
                  onClick={() => updateNotifications({ ...notifications, [key]: !enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    enabled ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </h2>
          <div className="mt-4 space-y-4">
            <Link to="/privacy" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-gray-900">Privacy Policy</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Link>
            <Link to="/data" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-gray-900">Data Usage</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Link>
            <Link to="/cookies" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-gray-900">Cookie Preferences</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Settings;