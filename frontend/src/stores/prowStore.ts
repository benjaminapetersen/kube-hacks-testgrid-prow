import { create } from 'zustand';
import type { ProwJobState, ProwJobType } from '../types/prow';

interface ProwState {
  searchTerm: string;
  stateFilter: ProwJobState | '';
  typeFilter: ProwJobType | '';
  setSearchTerm: (term: string) => void;
  setStateFilter: (state: ProwJobState | '') => void;
  setTypeFilter: (type: ProwJobType | '') => void;
  clearFilters: () => void;
}

export const useProwStore = create<ProwState>((set) => ({
  searchTerm: '',
  stateFilter: '',
  typeFilter: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setStateFilter: (stateFilter) => set({ stateFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  clearFilters: () => set({ searchTerm: '', stateFilter: '', typeFilter: '' }),
}));
