import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedPollOption } from '@/types/feed';

export function usePoll(pollId: string | undefined) {
  const { supabaseClient, session } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [options, setOptions] = useState<FeedPollOption[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabaseClient || !pollId || !session?.user?.id) return;

    // Check if user has voted
    supabaseClient
      .from('poll_votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setHasVoted(true);
          setSelectedOptionId(data.option_id);
        }
      });
  }, [supabaseClient, pollId, session]);

  const vote = useCallback(async (optionId: string) => {
    if (!supabaseClient || !pollId || !session?.user?.id || hasVoted) return;
    setLoading(true);

    try {
      const { error } = await supabaseClient
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: session.user.id,
        });

      if (error) throw error;

      setHasVoted(true);
      setSelectedOptionId(optionId);

      // Update local counts
      setOptions(prev => prev.map(o =>
        o.id === optionId ? { ...o, vote_count: o.vote_count + 1 } : o
      ));
      setTotalVotes(prev => prev + 1);
    } catch {
      // Silently fail — likely duplicate vote
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, pollId, session, hasVoted]);

  return { hasVoted, selectedOptionId, options, totalVotes, vote, loading, setOptions, setTotalVotes };
}
