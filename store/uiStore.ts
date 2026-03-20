'use client';
import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UiState {
  mobileNavOpen: boolean;
  cartDrawerOpen: boolean;
  toasts: ToastMessage[];
  announcementVisible: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  hideAnnouncement: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  mobileNavOpen: false,
  cartDrawerOpen: false,
  toasts: [],
  announcementVisible: true,

  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),

  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    const duration = toast.duration ?? 3500;
    setTimeout(() => get().removeToast(id), duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  hideAnnouncement: () => set({ announcementVisible: false }),
}));
