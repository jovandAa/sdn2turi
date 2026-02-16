import { create } from "zustand";

type UiState = {
  mobileNavOpen: boolean;
  activeDropdown: string | null;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setActiveDropdown: (dropdown: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  activeDropdown: null,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  setActiveDropdown: (dropdown) => set({ activeDropdown: dropdown }),
}));
