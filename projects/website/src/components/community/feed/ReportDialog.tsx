import React, { useState } from 'react';
import { usePostActions } from '@/hooks/usePostActions';

interface ReportDialogProps {
  postId: string;
  onClose: () => void;
}

const REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'off_topic', label: 'Off-topic' },
  { value: 'misinformation', label: 'Misinformation' },
  { value: 'other', label: 'Other' },
];

const ReportDialog: React.FC<ReportDialogProps> = ({ postId, onClose }) => {
  const { reportPost } = usePostActions(postId);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);

    const success = await reportPost(reason, description || undefined);
    if (success) {
      setSubmitted(true);
      setTimeout(onClose, 2000);
    }
    setSubmitting(false);
  };

  return (
    <div className="report-dialog__overlay" onClick={onClose}>
      <div className="report-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Report Post</h3>

        {submitted ? (
          <div className="report-dialog__success">
            <i className="fa-solid fa-check-circle"></i> Report submitted
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="report-dialog__reasons">
              {REASONS.map(r => (
                <label key={r.value} className="report-dialog__reason">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                  />
                  {r.label}
                </label>
              ))}
            </div>

            <textarea
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />

            <div className="report-dialog__actions">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={!reason || submitting}>
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportDialog;
