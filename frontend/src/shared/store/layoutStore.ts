import { create } from 'zustand';

interface LayoutState {
    isSidebarOpen: boolean;
    isSearchOpen: boolean;
    notificationCount: number;

    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    toggleSearch: () => void;
    setNotificationCount: (count: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
    isSidebarOpen: true,
    isSearchOpen: false,
    notificationCount: 0,

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    setNotificationCount: (count) => set({ notificationCount: count }),
}));
