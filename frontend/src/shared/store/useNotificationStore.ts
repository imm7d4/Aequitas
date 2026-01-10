import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api/apiClient';

export interface NotificationAction {
    label: string;
    link: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'ORDER' | 'SYSTEM' | 'ALERT' | 'ACCOUNT';
    title: string;
    message: string;
    data?: Record<string, any>;
    actions?: NotificationAction[];
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    fetchNotifications: () => Promise<void>;
    reset: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist<NotificationState>(
        (set) => ({
            notifications: [],
            unreadCount: 0,
            addNotification: (notification) =>
                set((state) => {
                    // Avoid duplicates if needed, typically by ID
                    if (state.notifications.some((n) => n.id === notification.id)) {
                        return state;
                    }
                    const newNotifications = [notification, ...state.notifications];
                    return {
                        notifications: newNotifications,
                        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
                    };
                }),
            setNotifications: (notifications) =>
                set(() => ({
                    notifications,
                    unreadCount: notifications.filter((n) => !n.isRead).length,
                })),
            markAsRead: (id) =>
                set((state) => {
                    // Optimistic update
                    const updated = state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    );

                    // Fire and forget API call
                    api.put(`/notifications/${id}/read`).catch(console.error);

                    return {
                        notifications: updated,
                        unreadCount: updated.filter((n) => !n.isRead).length,
                    };
                }),
            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }));
                api.put('/notifications/read-all').catch(console.error);
            },
            reset: () => {
                set({ notifications: [], unreadCount: 0 });
                api.delete('/notifications').catch(console.error);
            },
            fetchNotifications: async () => {
                try {
                    const { data: responseData } = await api.get<{ data: Notification[] }>('/notifications');
                    const notifications = responseData.data;

                    if (!Array.isArray(notifications)) {
                        console.warn('fetchNotifications received non-array:', notifications);
                        set({ notifications: [], unreadCount: 0 });
                        return;
                    }
                    set({
                        notifications,
                        unreadCount: notifications.filter((n) => !n.isRead).length
                    });
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        }),
        {
            name: 'notification-storage',
            partialize: (state) => ({
                notifications: state.notifications,
                unreadCount: state.unreadCount
            }),
        }
    )
);
