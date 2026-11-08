import { DecisionAnalysis } from '../types/decision';
import { SAMPLE_ANALYSIS } from '../data/sampleDecision';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions';
const ACTIVE_DECISION_KEY = 'the_tiebreaker_active_id';

function getRawDecisions(): DecisionAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse decisions from storage', e);
    return [];
  }
}

export function loadSavedDecisions(): DecisionAnalysis[] {
  const list = getRawDecisions();
  if (list.length === 0) {
    // Seed initial sample directly without calling saveDecision to prevent recursion
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([SAMPLE_ANALYSIS]));
      localStorage.setItem(ACTIVE_DECISION_KEY, SAMPLE_ANALYSIS.id);
    } catch (e) {
      console.error('Failed to seed default decision', e);
    }
    return [SAMPLE_ANALYSIS];
  }
  return list;
}

export function saveDecision(decision: DecisionAnalysis): void {
  try {
    const current = getRawDecisions();
    const index = current.findIndex((d) => d.id === decision.id);
    let updated: DecisionAnalysis[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = decision;
    } else {
      updated = [decision, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_DECISION_KEY, decision.id);
  } catch (e) {
    console.error('Failed to save decision to storage', e);
  }
}

export function deleteDecision(id: string): DecisionAnalysis[] {
  try {
    const current = getRawDecisions().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to delete decision', e);
    return [];
  }
}

export function getActiveDecisionId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_DECISION_KEY);
  } catch {
    return null;
  }
}

export function setActiveDecisionId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_DECISION_KEY, id);
  } catch {}
}
