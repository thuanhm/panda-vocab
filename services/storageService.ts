import { VocabSet, VocabItem } from '../types';

const STORAGE_KEY = 'pandavocab_sets';

export function getSavedSets(): VocabSet[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved sets:', error);
    return [];
  }
}

export function createVocabSet(name: string): VocabSet[] {
  const sets = getSavedSets();
  const newSet: VocabSet = {
    id: `set-${Date.now()}`,
    name: name.trim(),
    createdAt: Date.now(),
    items: [],
  };
  
  const updatedSets = [...sets, newSet];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSets));
  return updatedSets;
}

export function updateVocabSet(setId: string, newItems: VocabItem[]): VocabSet[] {
  const sets = getSavedSets();
  const updatedSets = sets.map(set => {
    if (set.id === setId) {
      return {
        ...set,
        items: [...set.items, ...newItems],
      };
    }
    return set;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSets));
  return updatedSets;
}

export function deleteVocabSet(setId: string): VocabSet[] {
  const sets = getSavedSets();
  const updatedSets = sets.filter(set => set.id !== setId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSets));
  return updatedSets;
}
