/**
 * @fileoverview Integrations showcase section with request modal.
 *
 * Lists supported third-party tool names in a responsive grid and
 * provides a "Request an Integration" modal form so users can submit
 * feature requests inline.
 *
 * @module components/sections/Integrations
 */

import React, { useState } from 'react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';
import { X, Send } from 'lucide-react';

export const Integrations: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [integrationName, setIntegrationName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);

    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setIntegrationName('');
      setEmail('');
      setDescription('');
    }, 2000);
  };

  return (
    <Section id="integrations" background="light">
      <SectionHeader
        title="Seamless Integrations"
        subtitle="Connect with all your favorite tools. Works with 1000+ apps out of the box."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {config.integrations.map((integration, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 flex items-center justify-center border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="text-gray-700 font-semibold text-sm text-center">
              {integration}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm mb-3">
          Don't see your tool? We add new integrations every week.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="text-orange-600 font-semibold hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
        >
          Request an Integration
          <span>→</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request an Integration</h2>
            <p className="text-gray-600 mb-6">
              Tell us which tool you'd like to see integrated
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Name
                  </label>
                  <input
                    type="text"
                    value={integrationName}
                    onChange={(e) => setIntegrationName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="e.g., Trello, Monday.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you need this integration?
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your use case..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  We've received your integration request and will review it shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
};
