import type { DetachedValue } from '../types';

export function isDetachedValue<T>(obj: any): obj is DetachedValue<T> {
  try {
    return '__detached' in obj;
  } catch {
    return false;
  }
}
