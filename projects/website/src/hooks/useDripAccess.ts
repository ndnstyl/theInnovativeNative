import { useMemo } from 'react';
import type { ModuleWithLessons, ModuleWithDripStatus } from '@/types/supabase';

/**
 * Compute module lock status based on enrollment date + drip_days.
 * Modules with drip_days = 0 are always unlocked.
 * drip_days is stored as module sort_order offset from enrollment —
 * convention: module.sort_order * 7 = drip days (one module per week).
 * Override via dripSchedule map { moduleId: days }.
 */
export function useDripAccess(
  modules: ModuleWithLessons[],
  enrolledAt: string | null,
  dripSchedule?: Record<string, number>
) {
  return useMemo(() => {
    if (!enrolledAt) {
      // Not enrolled — all locked
      return modules.map((m): ModuleWithDripStatus => ({
        ...m,
        is_locked: true,
        unlocks_at: null,
        drip_days: 0,
      }));
    }

    const enrollDate = new Date(enrolledAt);
    const now = new Date();

    return modules.map((m): ModuleWithDripStatus => {
      // If a custom drip schedule is provided, use it; otherwise module index * 7 days
      const dripDays = dripSchedule?.[m.id] ?? 0;

      if (dripDays <= 0) {
        return { ...m, is_locked: false, unlocks_at: null, drip_days: 0 };
      }

      const unlockDate = new Date(enrollDate);
      unlockDate.setDate(unlockDate.getDate() + dripDays);

      const isLocked = now < unlockDate;

      return {
        ...m,
        is_locked: isLocked,
        unlocks_at: isLocked ? unlockDate : null,
        drip_days: dripDays,
      };
    });
  }, [modules, enrolledAt, dripSchedule]);
}

/**
 * Helper: compute human-readable "Unlocks in X days" string.
 */
export function formatDripCountdown(unlockDate: Date): string {
  const now = new Date();
  const diff = unlockDate.getTime() - now.getTime();
  if (diff <= 0) return 'Available now';

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return 'Unlocks tomorrow';
  if (days < 7) return `Unlocks in ${days} days`;
  const weeks = Math.floor(days / 7);
  const remainDays = days % 7;
  if (remainDays === 0) return `Unlocks in ${weeks} week${weeks > 1 ? 's' : ''}`;
  return `Unlocks in ${weeks}w ${remainDays}d`;
}
