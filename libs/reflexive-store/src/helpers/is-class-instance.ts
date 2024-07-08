import { DetachedValue } from '../utils';

export function isClassInstance(value: any): boolean {
  if (value instanceof DetachedValue || Array.isArray(value)) return false;

  return typeof value === 'object' && value !== null && value.constructor && typeof value.constructor === 'function';
}
