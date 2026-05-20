import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

const AwardPointsModal: React.FC<Props> = ({ isOpen, onClose, memberId, memberName }) => {
  const { supabaseClient } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (points === 0) {
      setError('Points must be non-zero');
      return;
    }
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcErr } = await supabaseClient.rpc('admin_award_points', {
        p_member_id: memberId,
        p_points: points,
        p_reason: reason.trim(),
      });

      if (rpcErr) throw rpcErr;

      setSuccess(`${points > 0 ? 'Awarded' : 'Adjusted'} ${Math.abs(points)} points. New total: ${data}`);
      setPoints(0);
      setReason('');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="award-modal__overlay" onClick={onClose}>
      <div className="award-modal" onClick={(e) => e.stopPropagation()}>
        <div className="award-modal__header">
          <h3>Award Points to {memberName}</h3>
          <button className="award-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="award-modal__form">
          <div className="award-modal__field">
            <label>Points (negative for penalty)</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              min={-10000}
              max={10000}
            />
          </div>
          <div className="award-modal__field">
            <label>Reason (required)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Why are you awarding/adjusting points?"
            />
          </div>
          {error && <p className="award-modal__error">{error}</p>}
          {success && <p className="award-modal__success">{success}</p>}
          <div className="award-modal__actions">
            <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Saving...' : points >= 0 ? 'Award Points' : 'Apply Penalty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AwardPointsModal;
