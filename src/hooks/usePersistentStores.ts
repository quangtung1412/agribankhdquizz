import { useCallback, useEffect, useRef, useState } from 'react';
import { KnowledgeBase, QuizAttempt } from '../../types';

// Versioning to allow migrations later
const STORAGE_VERSION = 1;

interface Persisted<T> { version: number; data: T }

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: Persisted<T> | T = JSON.parse(raw);
    if ((parsed as Persisted<T>).version !== undefined) {
      const obj = parsed as Persisted<T>;
      // Potential migrations here if version < STORAGE_VERSION
      return obj.data;
    }
    return parsed as T; // legacy (no wrapper)
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, data: value } as Persisted<T>));
}

export function useKnowledgeBaseStore(userEmail: string | null) {
  const key = userEmail ? `quizmaster_v${STORAGE_VERSION}_bases_${userEmail.toLowerCase()}` : null;
  const [bases, setBases] = useState<KnowledgeBase[]>(() => (key ? load<KnowledgeBase[]>(key, []) : []));
  const initialized = useRef(false);

  useEffect(() => {
    if (!key) { setBases([]); return; }
    // hydrate on user change
    setBases(load<KnowledgeBase[]>(key, []));
    initialized.current = true;
  }, [key]);

  const updateBases = useCallback((next: KnowledgeBase[] | ((prev: KnowledgeBase[]) => KnowledgeBase[])) => {
    setBases(prev => {
      const value = typeof next === 'function' ? (next as any)(prev) : next;
      if (key) save(key, value);
      return value;
    });
  }, [key]);

  return { bases, setBases: updateBases };
}

export function useAttemptStore(userEmail: string | null) {
  const key = userEmail ? `quizmaster_v${STORAGE_VERSION}_attempts_${userEmail.toLowerCase()}` : null;
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => (key ? load<QuizAttempt[]>(key, []) : []));

  useEffect(() => {
    if (!key) { setAttempts([]); return; }
    setAttempts(load<QuizAttempt[]>(key, []));
  }, [key]);

  const updateAttempts = useCallback((next: QuizAttempt[] | ((prev: QuizAttempt[]) => QuizAttempt[])) => {
    setAttempts(prev => {
      const value = typeof next === 'function' ? (next as any)(prev) : next;
      if (key) save(key, value);
      return value;
    });
  }, [key]);

  return { attempts, setAttempts: updateAttempts };
}
