import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Settings</span>
      </button>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Data Collection</span>
            </h2>
            <p className="text-gray-600">
              We collect only the information necessary to provide you with task management,
              homework tracking, and mindfulness features. This includes:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Tasks and assignments you create</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Progress tracking and achievement data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Exercise feedback and mood tracking entries</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Data Usage</span>
            </h2>
            <p className="text-gray-600">
              Your data is used solely to provide and improve our services. We do not:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Sell your personal information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Share data with third parties without consent</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Use data for advertising purposes</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>Your Rights</span>
            </h2>
            <p className="text-gray-600">You have the right to:</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Access your personal data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Export your data at any time</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Request deletion of your data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>Update or correct your information</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}