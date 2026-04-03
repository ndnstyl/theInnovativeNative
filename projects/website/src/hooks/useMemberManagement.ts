import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_ID } from '@/lib/constants';

export interface ManagedMember {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  email: string | null;
  role: string;
  status: string;
  joined_at: string;
  last_active_at: string | null;
}

export function useMemberManagement() {
  const { supabaseClient, session, role } = useAuth();
  const [members, setMembers] = useState<ManagedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const isAdmin = role === 'admin' || role === 'moderator' || role === 'owner';

  const fetchMembers = useCallback(async () => {
    if (!supabaseClient || !session || !isAdmin) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data } = await supabaseClient
      .from('community_members')
      .select('member_id, role, status, joined_at, profiles!community_members_member_id_fkey(display_name, avatar_url, last_active_at)')
      .eq('community_id', COMMUNITY_ID)
      .order('joined_at', { ascending: false })
      .limit(100);

    const mapped = (data as any[] || []).map((m: any) => ({
      user_id: m.member_id,
      display_name: m.profiles?.display_name || 'Unknown',
      avatar_url: m.profiles?.avatar_url || null,
      email: null,
      role: m.role,
      status: m.status,
      joined_at: m.joined_at,
      last_active_at: m.profiles?.last_active_at || null,
    }));

    let filtered = mapped;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((m: ManagedMember) => m.display_name.toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter((m: ManagedMember) => m.role === roleFilter);
    }

    setMembers(filtered);
    setLoading(false);
  }, [supabaseClient, session, isAdmin, search, roleFilter]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const changeRole = useCallback(async (memberId: string, newRole: string) => {
    if (!supabaseClient || !isAdmin) return;
    const { data } = await supabaseClient.rpc('change_member_role', {
      p_target_member_id: memberId,
      p_new_role: newRole,
    });
    if ((data as any)?.success) fetchMembers();
    return data;
  }, [supabaseClient, isAdmin, fetchMembers]);

  const banMember = useCallback(async (memberId: string, reason?: string) => {
    if (!supabaseClient || !isAdmin) return;
    const { data } = await supabaseClient.rpc('ban_member', {
      p_member_id: memberId,
      p_reason: reason || undefined,
    });
    if ((data as any)?.success) fetchMembers();
    return data;
  }, [supabaseClient, isAdmin, fetchMembers]);

  const unbanMember = useCallback(async (memberId: string) => {
    if (!supabaseClient || !isAdmin) return;
    const { data } = await supabaseClient.rpc('unban_member', {
      p_member_id: memberId,
    });
    if ((data as any)?.success) fetchMembers();
    return data;
  }, [supabaseClient, isAdmin, fetchMembers]);

  return {
    members, loading, search, setSearch, roleFilter, setRoleFilter,
    changeRole, banMember, unbanMember, refetch: fetchMembers,
  };
}
