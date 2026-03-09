import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Invitation } from '@/types/supabase';

const InvitationForm: React.FC = () => {
  const { supabaseClient, session } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInvitations = async () => {
    const { data } = await supabaseClient
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    setInvitations(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !session?.user?.id) return;
    setIsSending(true);
    setFeedback(null);

    const { data: community } = await supabaseClient
      .from('communities')
      .select('id')
      .limit(1)
      .single();

    if (!community) {
      setFeedback({ type: 'error', text: 'Community not found' });
      setIsSending(false);
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error } = await supabaseClient
      .from('invitations')
      .insert({
        community_id: community.id,
        email: email.trim(),
        invited_by: session.user.id,
        personal_message: message.trim() || null,
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      setFeedback({ type: 'error', text: error.message });
    } else {
      setFeedback({ type: 'success', text: `Invitation sent to ${email}` });
      setEmail('');
      setMessage('');
      await fetchInvitations();
    }
    setIsSending(false);
  };

  const handleRevoke = async (id: string) => {
    await supabaseClient
      .from('invitations')
      .update({ status: 'revoked' })
      .eq('id', id);

    await fetchInvitations();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'accepted': return '#00FF88';
      case 'expired': return '#757575';
      case 'revoked': return '#ff4444';
      default: return '#757575';
    }
  };

  return (
    <div className="invitation-form">
      <p className="invitation-form__desc">
        Invite members by email. They&apos;ll receive a link to join the community directly (bypasses approval queue).
      </p>

      <form onSubmit={handleSend} className="invitation-form__form">
        <div className="form-group">
          <label htmlFor="invite-email">Email Address</label>
          <input
            type="email"
            id="invite-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="person@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="invite-message">
            Personal Message <span style={{ color: '#4a4a4a' }}>(optional, max 500 chars)</span>
          </label>
          <textarea
            id="invite-message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="Hey, you should join our community..."
            rows={2}
            maxLength={500}
          />
        </div>

        {feedback && (
          <div className={`invitation-form__feedback invitation-form__feedback--${feedback.type}`}>
            {feedback.text}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--sm" disabled={isSending || !email}>
          {isSending ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>

      <h3 className="invitation-form__history-title">Invitation History</h3>

      {isLoading ? (
        <p style={{ color: '#757575', fontSize: 13 }}>Loading...</p>
      ) : invitations.length === 0 ? (
        <p style={{ color: '#4a4a4a', fontSize: 13 }}>No invitations sent yet.</p>
      ) : (
        <div className="invitation-form__list">
          {invitations.map((inv) => (
            <div key={inv.id} className="invitation-form__item">
              <div>
                <span className="invitation-form__email">{inv.email}</span>
                <span
                  className="invitation-form__status"
                  style={{ color: statusColor(inv.status) }}
                >
                  {inv.status}
                </span>
              </div>
              <div className="invitation-form__item-meta">
                <span>{new Date(inv.created_at).toLocaleDateString()}</span>
                {inv.status === 'pending' && (
                  <button
                    className="invitation-form__revoke"
                    onClick={() => handleRevoke(inv.id)}
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationForm;
