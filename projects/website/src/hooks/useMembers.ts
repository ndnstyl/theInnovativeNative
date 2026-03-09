import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { MemberCardData, Role } from '@/types/members';

const PAGE_SIZE = 20;

export function useMembers() {
  const { supabaseClient } = useAuth();
  const [members, setMembers] = useState<MemberCardData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | null>(null);
  const [page, setPage] = useState(0);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query: profiles joined with community_members
      let query = supabaseClient
        .from('community_members')
        .select(`
          member_id,
          role,
          joined_at,
          profiles!inner (
            id,
            display_name,
            username,
            avatar_url,
            bio,
            level,
            last_active_at,
            membership_status
          )
        `, { count: 'exact' })
        .is('deleted_at', null)
        .eq('profiles.membership_status', 'approved');

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      if (searchQuery) {
        query = query.or(
          `profiles.display_name.ilike.%${searchQuery}%,profiles.username.ilike.%${searchQuery}%`
        );
      }

      const { data, error: queryError, count } = await query
        .order('joined_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (queryError) {
        setError(queryError.message);
        return;
      }

      const mapped: MemberCardData[] = (data || []).map((row: any) => ({
        id: row.profiles.id,
        display_name: row.profiles.display_name,
        username: row.profiles.username,
        avatar_url: row.profiles.avatar_url,
        bio: row.profiles.bio,
        role: row.role as Role,
        level: row.profiles.level,
        joined_at: row.joined_at,
        last_active_at: row.profiles.last_active_at,
      }));

      setMembers(mapped);
      setTotalCount(count || 0);
    } catch (err) {
      setError('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, searchQuery, roleFilter, page]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(0);
  }, []);

  const filterByRole = useCallback((role: Role | null) => {
    setRoleFilter(role);
    setPage(0);
  }, []);

  return {
    members,
    totalCount,
    isLoading,
    error,
    search,
    filterByRole,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
  };
}
