import React, { useState, useCallback } from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function PrivacySettings() {
  const { supabaseClient, session } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const exportData = useCallback(async () => {
    if (!supabaseClient || !session) return;
    setExporting(true);
    setMessage('');

    const { data, error } = await supabaseClient.rpc('export_user_data', {
      p_user_id: session.user.id,
    });

    if (error) {
      setMessage('Export failed. Please try again.');
    } else {
      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Data exported successfully.');
    }
    setExporting(false);
  }, [supabaseClient, session]);

  const requestDeletion = useCallback(async () => {
    if (!supabaseClient || !session) return;
    setDeleting(true);

    await supabaseClient.from('deletion_requests').insert({
      user_id: session.user.id,
      reason: 'User requested account deletion',
    });

    setMessage('Deletion request submitted. Your account will be processed within 30 days.');
    setDeleting(false);
    setDeleteConfirm(false);
  }, [supabaseClient, session]);

  return (
    <ClassroomLayout title="Privacy">
      <div className="privacy-settings">
        <h2 className="privacy-settings__title">Privacy & Data</h2>

        {message && (
          <div className="privacy-settings__message">{message}</div>
        )}

        <section className="privacy-settings__section">
          <h3>Export Your Data</h3>
          <p>Download a copy of all your data including profile, posts, comments, and course progress.</p>
          <button className="btn btn--primary" onClick={exportData} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export My Data'}
          </button>
        </section>

        <section className="privacy-settings__section privacy-settings__section--danger">
          <h3>Delete Account</h3>
          <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
          {deleteConfirm ? (
            <div className="privacy-settings__confirm">
              <p className="privacy-settings__warning">
                Are you sure? This will permanently remove your profile, posts, comments, and all associated data.
              </p>
              <div className="privacy-settings__confirm-actions">
                <button className="btn btn--danger" onClick={requestDeletion} disabled={deleting}>
                  {deleting ? 'Submitting...' : 'Yes, Delete My Account'}
                </button>
                <button className="btn btn--ghost" onClick={() => setDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn--danger-outline" onClick={() => setDeleteConfirm(true)}>
              Request Account Deletion
            </button>
          )}
        </section>
      </div>
    </ClassroomLayout>
  );
}
