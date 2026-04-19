import type { SqlStyleRules } from '../types/sql';

export function readStoredRules(): SqlStyleRules | null {
  const saved = localStorage.getItem('sqlStyleRules');
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as SqlStyleRules;
  } catch {
    return null;
  }
}
