import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types/members';
import { ROLE_HIERARCHY } from '@/types/members';

export function useRole() {
  const { role } = useAuth();

  return useMemo(() => {
    const currentLevel = role ? ROLE_HIERARCHY[role] : 0;

    const isAtLeast = (requiredRole: Role): boolean => {
      return currentLevel >= ROLE_HIERARCHY[requiredRole];
    };

    const canManageRoles = isAtLeast('admin');

    const canPromoteTo = (targetRole: Role): boolean => {
      if (!role) return false;
      if (role === 'owner') return true;
      if (role === 'admin') return targetRole === 'moderator' || targetRole === 'member';
      return false;
    };

    const canRemoveMember = (targetRole: Role): boolean => {
      if (!role) return false;
      if (role === 'owner') return true;
      if (role === 'admin') return targetRole === 'moderator' || targetRole === 'member';
      return false;
    };

    return { role, canManageRoles, canPromoteTo, canRemoveMember, isAtLeast };
  }, [role]);
}
