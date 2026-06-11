import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: true,
      toggleTheme: () => set((state) => {
        const newIsDarkMode = !state.isDarkMode;
        if (newIsDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newIsDarkMode };
      }),
      initTheme: () => set((state) => {
        if (state.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: state.isDarkMode };
      }),
    }),
    {
      name: 'katedra-theme-storage-v2',
    }
  )
);
