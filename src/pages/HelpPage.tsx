import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const HelpPage: React.FC = () => {
  const { submitFeedback, feedback } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Form state
  const [fbCategory, setFbCategory] = useState<any>('General');
  const [fbModule, setFbModule] = useState('Dashboard');
  const [fbMessage, setFbMessage] = useState('');
  const [fbSubmitted, setFbSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I find a classroom or laboratory?',
      a: 'Go to Campus Navigation (/navigation) from the sidebar. You can search by room number (e.g. "304" or "Lecture Hall 203"), pick a starting location (e.g. Main Gate or Library), and follow the schematic route with turn-by-turn walking landmarks.',
    },
    {
      q: 'Are the cafeteria queue times and seating live measurements?',
      a: 'No. Cafeteria queue lengths and seating occupancy are simulated sample estimates modeled on typical student lunch rushes. In a production deployment, this would be backed by cafeteria turnstiles or kitchen queue telemetry.',
    },
    {
      q: 'How does Lost & Found ownership verification work?',
      a: 'When reporting an item, you provide a private verification clue (such as a serial number suffix, custom sticker, or lock screen detail) that is never displayed publicly. When someone claims the item, they enter their proof, and a one-time handover token (e.g. CC-8429) is generated for campus security staff to verify in person.',
    },
    {
      q: 'How do event reminders and calendar sync operate?',
      a: 'Toggling a reminder registers an in-app alert within Campus Companion’s Notification Center. Since this is an offline-capable client prototype, it does not send external SMS or emails.',
    },
    {
      q: 'Is Campus Companion connected to real campus database systems?',
      a: 'Campus Companion is currently operating as an offline-first interactive prototype with curated, realistic demo data. All timetable edits, task creations, cafeteria orders, and profile settings are stored securely in your browser’s localStorage and persist between page refreshes.',
    },
    {
      q: 'How can I reset my test data back to default?',
      a: 'You can click "Reset Demo" in the top notification bar or navigate to Profile & Settings (/profile) and click "Reset Demo State". After confirmation, the app will reload its clean initial seed dataset.',
    },
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) return;

    submitFeedback(fbCategory, fbModule, fbMessage.trim());
    setFbMessage('');
    setFbSubmitted(true);
    setTimeout(() => setFbSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#315CEB]" />
            <span>Support & Documentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Campus Companion FAQ & Feedback
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Learn how the platform simplifies campus routines and submit usability feedback for ongoing improvements.
          </p>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl text-xs space-y-1">
          <span className="font-bold text-[#17243A] block">Product Version:</span>
          <span className="text-[#667085]">v1.1 (HCI Research Prototype)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="font-display font-bold text-lg text-[#17243A] mb-3">
            Frequently Asked Questions
          </h3>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E3E5E8] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#17243A] hover:bg-[#FAF9F5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#315CEB] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#475467] leading-relaxed border-t border-[#E3E5E8]/60 bg-[#FAF9F5]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: User Feedback Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs space-y-4 self-start">
          <div>
            <h3 className="font-display font-bold text-base text-[#17243A]">
              Send Us Usability Feedback
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Suggestions for navigation, cafeteria queues, or timetable workflows.
            </p>
          </div>

          {fbSubmitted ? (
            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-xs text-[#166534] space-y-2 text-center py-8">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#20845A]" />
              <h4 className="font-bold text-sm">Feedback Recorded!</h4>
              <p>Thank you for testing Campus Companion. Your feedback has been stored locally.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17243A] block mb-1">
                    Feedback Category
                  </label>
                  <select
                    value={fbCategory}
                    onChange={(e) => setFbCategory(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs font-medium text-[#17243A]"
                  >
                    <option value="General">General UX</option>
                    <option value="Navigation">Navigation & Maps</option>
                    <option value="Cafeteria">Cafeteria</option>
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="Timetable">Timetable</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Idea">Feature Idea</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17243A] block mb-1">
                    Relevant Module
                  </label>
                  <select
                    value={fbModule}
                    onChange={(e) => setFbModule(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs font-medium text-[#17243A]"
                  >
                    <option value="Dashboard">Dashboard</option>
                    <option value="Navigation">Navigation</option>
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="Cafeteria">Cafeteria</option>
                    <option value="Events">Events</option>
                    <option value="Projects">Projects</option>
                    <option value="Clubs">Clubs</option>
                    <option value="Services">Services</option>
                    <option value="Timetable">Timetable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17243A] block mb-1">
                  Your Observations or Suggestions *
                </label>
                <textarea
                  rows={4}
                  required
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="Tell us what worked smoothly or what caused confusion during your campus task..."
                  className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-3 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Local Feedback</span>
              </button>
            </form>
          )}

          {/* Past feedback counter */}
          {feedback.length > 0 && (
            <div className="pt-3 border-t border-[#E3E5E8] text-xs text-[#667085]">
              <span>{feedback.length} user feedback entries saved in this session.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
