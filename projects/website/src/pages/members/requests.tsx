import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLastActive } from '@/hooks/useLastActive';

interface PendingRequest {
  id: string;
  user_id: string;
  answers: any;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
    username: string | null;
  };
}

const MemberRequests = () => {
  useLastActive();
  const { supabaseClient, session } = useAuth();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    const { data } = await supabaseClient
      .from('membership_requests')
      .select(`
        id,
        user_id,
        answers,
        created_at,
        profiles!inner (display_name, avatar_url, username)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    setRequests((data as unknown as PendingRequest[]) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, userId: string, action: 'approved' | 'declined') => {
    // Update request status
    await supabaseClient
      .from('membership_requests')
      .update({
        status: action,
        reviewed_by: session?.user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    // Update profile membership status
    await supabaseClient
      .from('profiles')
      .update({ membership_status: action })
      .eq('id', userId);

    await fetchRequests();
  };

  return (
    <ClassroomLayout title="Membership Requests">
      <ProtectedRoute requiredRole={['owner', 'admin']}>
        <Head>
          <title>Membership Requests | The Innovative Native</title>
        </Head>
        <div className="member-requests">
          <h1>Membership Requests</h1>

          {isLoading ? (
            <p style={{ color: '#757575' }}>Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="member-requests__empty">
              <i className="fa-solid fa-inbox" style={{ fontSize: 32, color: '#333', marginBottom: 12 }}></i>
              <p>No pending requests</p>
            </div>
          ) : (
            <div className="member-requests__list">
              {requests.map((req) => (
                <div key={req.id} className="member-requests__card">
                  <div className="member-requests__header">
                    <div className="member-requests__avatar">
                      {req.profiles.avatar_url ? (
                        <img src={req.profiles.avatar_url} alt="" />
                      ) : (
                        <span>{req.profiles.display_name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <span className="member-requests__name">{req.profiles.display_name}</span>
                      <span className="member-requests__date">
                        Applied {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {req.answers && Array.isArray(req.answers) && req.answers.length > 0 && (
                    <div className="member-requests__answers">
                      {(req.answers as any[]).map((a: any, i: number) => (
                        <div key={i} className="member-requests__answer">
                          <span className="member-requests__question">{a.question}</span>
                          <p>{a.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="member-requests__actions">
                    <button
                      className="btn btn--sm btn--primary"
                      onClick={() => handleAction(req.id, req.user_id, 'approved')}
                    >
                      <i className="fa-solid fa-check"></i> Approve
                    </button>
                    <button
                      className="btn btn--sm btn--outline"
                      onClick={() => handleAction(req.id, req.user_id, 'declined')}
                    >
                      <i className="fa-solid fa-xmark"></i> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default MemberRequests;
