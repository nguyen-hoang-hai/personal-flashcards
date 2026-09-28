import { Rating, UserCardProgress } from '../types';

export interface ScheduleResult {
  status: 'new' | 'learning' | 'review' | 'mastered' | 'suspended';
  repetitions: number;
  lapses: number;
  interval_days: number;
  ease_factor: number;
  due_at: string;
}

export function calculateNextSchedule(
  current: Partial<UserCardProgress>,
  rating: Rating,
  now: Date = new Date()
): ScheduleResult {
  const repetitions = current.repetitions || 0;
  let lapses = current.lapses || 0;
  let interval = current.interval_days || 0;
  let ease = current.ease_factor || 2.5;
  const currentStatus = current.status || 'new';

  let nextStatus: 'learning' | 'review' | 'mastered' = 'review';
  let nextRepetitions = repetitions + 1;
  let nextIntervalDays = 1.0;
  let dueTime = new Date(now.getTime());

  if (rating === 'again') {
    lapses += 1;
    nextStatus = 'learning';
    nextRepetitions = 0;
    ease = Math.max(1.3, ease - 0.2);
    nextIntervalDays = 0; // learning step
    // due in 10 minutes
    dueTime = new Date(now.getTime() + 10 * 60 * 1000);
  } else if (rating === 'hard') {
    ease = Math.max(1.3, ease - 0.15);
    if (currentStatus === 'new' || currentStatus === 'learning') {
      nextIntervalDays = 1.0;
      nextStatus = 'learning';
    } else {
      nextIntervalDays = Math.max(1.0, Math.round(interval * 1.2 * 10) / 10);
      nextStatus = 'review';
    }
    dueTime = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
  } else if (rating === 'good') {
    if (currentStatus === 'new') {
      nextIntervalDays = 1.0;
      nextStatus = 'review';
    } else if (currentStatus === 'learning') {
      nextIntervalDays = 3.0;
      nextStatus = 'review';
    } else {
      nextIntervalDays = Math.max(1.0, Math.round(interval * ease * 10) / 10);
      nextStatus = nextIntervalDays >= 21 ? 'mastered' : 'review';
    }
    dueTime = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
  } else if (rating === 'easy') {
    ease = Math.min(3.0, ease + 0.15);
    if (currentStatus === 'new' || currentStatus === 'learning') {
      nextIntervalDays = 4.0;
      nextStatus = 'review';
    } else {
      nextIntervalDays = Math.max(4.0, Math.round(interval * ease * 1.3 * 10) / 10);
      nextStatus = nextIntervalDays >= 21 ? 'mastered' : 'review';
    }
    dueTime = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
  }

  return {
    status: nextStatus,
    repetitions: nextRepetitions,
    lapses,
    interval_days: nextIntervalDays,
    ease_factor: Math.round(ease * 100) / 100,
    due_at: dueTime.toISOString(),
  };
}

/**
 * Checks whether a progressive direction should be unlocked based on blueprint rule:
 * - >= 3 successful reviews
 * - Interval >= 7 days
 * - Rating Good / Easy
 * - Not suspended or leech
 */
export function canUnlockProgressiveDirection(progress: UserCardProgress, rating: Rating): boolean {
  if (rating === 'again') return false;
  return progress.repetitions >= 3 && progress.interval_days >= 7.0;
}
