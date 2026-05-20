import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { MembershipQuestion } from '@/types/supabase';

const MembershipQuestions: React.FC = () => {
  const { supabaseClient } = useAuth();
  const [questions, setQuestions] = useState<MembershipQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRequired, setEditRequired] = useState(true);
  const [newText, setNewText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    const { data } = await supabaseClient
      .from('membership_questions')
      .select('*')
      .order('sort_order');

    setQuestions(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const getCommunityId = async (): Promise<string | null> => {
    const { data } = await supabaseClient
      .from('communities')
      .select('id')
      .limit(1)
      .single();
    return data?.id || null;
  };

  const handleAdd = async () => {
    if (!newText.trim() || questions.length >= 3) return;
    setError(null);

    const communityId = await getCommunityId();
    if (!communityId) return;

    const { error: insertError } = await supabaseClient
      .from('membership_questions')
      .insert({
        community_id: communityId,
        question_text: newText.trim(),
        is_required: true,
        sort_order: questions.length + 1,
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setNewText('');
      await fetchQuestions();
    }
  };

  const handleUpdate = async (id: string) => {
    setError(null);
    const { error: updateError } = await supabaseClient
      .from('membership_questions')
      .update({
        question_text: editText.trim(),
        is_required: editRequired,
      })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setEditingId(null);
      await fetchQuestions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    setError(null);

    const { error: deleteError } = await supabaseClient
      .from('membership_questions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      await fetchQuestions();
    }
  };

  if (isLoading) return <p style={{ color: '#757575' }}>Loading questions...</p>;

  return (
    <div className="membership-questions">
      <p className="membership-questions__desc">
        Configure up to 3 questions new members must answer when joining. Leave empty for open registration.
      </p>

      {error && (
        <div className="membership-questions__error">{error}</div>
      )}

      <div className="membership-questions__list">
        {questions.map((q) => (
          <div key={q.id} className="membership-questions__item">
            {editingId === q.id ? (
              <div className="membership-questions__edit">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value.slice(0, 200))}
                  maxLength={200}
                  autoFocus
                  aria-label="Edit question text"
                />
                <label className="membership-questions__toggle">
                  <input
                    type="checkbox"
                    checked={editRequired}
                    onChange={(e) => setEditRequired(e.target.checked)}
                  />
                  Required
                </label>
                <div className="membership-questions__edit-actions">
                  <button className="btn btn--sm btn--primary" onClick={() => handleUpdate(q.id)}>
                    Save
                  </button>
                  <button className="btn btn--sm btn--outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="membership-questions__text">
                  <span className="membership-questions__order">Q{q.sort_order}</span>
                  {q.question_text}
                  {q.is_required && <span className="membership-questions__required">*</span>}
                </div>
                <div className="membership-questions__actions">
                  <button
                    className="membership-questions__btn"
                    onClick={() => {
                      setEditingId(q.id);
                      setEditText(q.question_text);
                      setEditRequired(q.is_required);
                    }}
                    aria-label="Edit question"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    className="membership-questions__btn membership-questions__btn--delete"
                    onClick={() => handleDelete(q.id)}
                    aria-label="Delete question"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {questions.length < 3 && (
        <div className="membership-questions__add">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value.slice(0, 200))}
            placeholder="New question (max 200 chars)..."
            maxLength={200}
            aria-label="New membership question"
          />
          <button
            className="btn btn--sm btn--primary"
            onClick={handleAdd}
            disabled={!newText.trim()}
          >
            Add
          </button>
        </div>
      )}

      {questions.length >= 3 && (
        <p className="membership-questions__limit">Maximum 3 questions reached.</p>
      )}
    </div>
  );
};

export default MembershipQuestions;
