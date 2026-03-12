import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type PaletteName = 'kubernetes' | 'ocean' | 'sunset' | 'forest' | 'slate';

interface AppState {
  sidebarOpen: boolean;
  themeMode: ThemeMode;
  palette: PaletteName;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleThemeMode: () => void;
  setPalette: (p: PaletteName) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  themeMode: 'dark',
  palette: 'kubernetes',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleThemeMode: () =>
    set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
  setPalette: (palette) => set({ palette }),
}));
