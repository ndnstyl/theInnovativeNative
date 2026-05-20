import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useEmailPreferences, EmailPrefs } from '@/hooks/useEmailPreferences';

const EMAIL_PREF_LABELS: { key: keyof EmailPrefs; label: string; desc: string }[] = [
  { key: 'welcome_email', label: 'Welcome Email', desc: 'Receive a welcome email when you join' },
  { key: 'enrollment_email', label: 'Enrollment Confirmations', desc: 'Get notified when you enroll in a course' },
  { key: 'payment_email', label: 'Payment Receipts', desc: 'Receive email receipts for payments' },
  { key: 'event_reminder', label: 'Event Reminders', desc: 'Get reminded before events you RSVP to' },
  { key: 'weekly_digest', label: 'Weekly Digest', desc: 'Summary of community activity each week' },
  { key: 'marketing', label: 'Product Updates', desc: 'New features, courses, and announcements' },
];

export default function EmailPreferencesPage() {
  const { prefs, loading, saving, updatePref } = useEmailPreferences();

  return (
    <ClassroomLayout title="Email Preferences">
      <div className="email-prefs">
        <h2 className="email-prefs__title">Email Preferences</h2>
        <p className="email-prefs__subtitle">Control which emails you receive from The Innovative Native.</p>

        {loading ? (
          <div className="admin-loading"><div className="admin-loading__spinner" /></div>
        ) : (
          <>
            <div className="email-prefs__list">
              {EMAIL_PREF_LABELS.map(({ key, label, desc }) => (
                <div key={key} className="email-prefs__item">
                  <div className="email-prefs__info">
                    <span className="email-prefs__label">{label}</span>
                    <span className="email-prefs__desc">{desc}</span>
                  </div>
                  <label className="email-prefs__toggle">
                    <input
                      type="checkbox"
                      checked={prefs[key] && !prefs.unsubscribed_all}
                      disabled={prefs.unsubscribed_all || saving}
                      onChange={e => updatePref(key, e.target.checked)}
                    />
                    <span className="email-prefs__toggle-track" />
                  </label>
                </div>
              ))}
            </div>

            <div className="email-prefs__unsubscribe">
              <label className="email-prefs__item email-prefs__item--danger">
                <div className="email-prefs__info">
                  <span className="email-prefs__label">Unsubscribe from all</span>
                  <span className="email-prefs__desc">Stop all email communications (except security alerts)</span>
                </div>
                <label className="email-prefs__toggle">
                  <input
                    type="checkbox"
                    checked={prefs.unsubscribed_all}
                    disabled={saving}
                    onChange={e => updatePref('unsubscribed_all', e.target.checked)}
                  />
                  <span className="email-prefs__toggle-track email-prefs__toggle-track--danger" />
                </label>
              </label>
            </div>
          </>
        )}
      </div>
    </ClassroomLayout>
  );
}
