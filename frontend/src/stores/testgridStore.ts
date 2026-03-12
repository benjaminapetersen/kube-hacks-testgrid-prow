import { create } from 'zustand';

interface TestGridState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
}

export const useTestGridStore = create<TestGridState>((set) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  clearFilters: () => set({ searchTerm: '' }),
}));
