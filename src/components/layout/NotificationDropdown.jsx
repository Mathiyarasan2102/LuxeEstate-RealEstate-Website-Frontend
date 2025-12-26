import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation
} from '../../store/notificationsApiSlice';
import { formatDistanceToNow } from 'date-fns';
import { NotificationSkeleton } from '../ui/Skeletons';

const NotificationDropdown = () => {
    const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });

    const [markRead] = useMarkNotificationReadMutation();
    const [markAllRead] = useMarkAllNotificationsReadMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const dropdownRef = useRef(null);
    const prevUnreadCountRef = useRef(0);
    const navigate = useNavigate();

    // Filter to show ONLY unread notifications
    const visibleNotifications = notifications.filter(n => !n.isRead);
    const unreadCount = visibleNotifications.length;

    // Trigger bell ringing animation when new notifications arrive
    useEffect(() => {
        // Initialize ref on first render
        if (prevUnreadCountRef.current === 0 && unreadCount > 0) {
            prevUnreadCountRef.current = unreadCount;
            return;
        }

        // Trigger animation when count increases
        if (unreadCount > prevUnreadCountRef.current) {
            console.log('🔔 Bell ringing triggered! Previous:', prevUnreadCountRef.current, 'Current:', unreadCount);
            setIsRinging(true);
            const timer = setTimeout(() => {
                setIsRinging(false);
                console.log('🔕 Bell ringing stopped');
            }, 3000);
            return () => clearTimeout(timer);
        }

        prevUnreadCountRef.current = unreadCount;
    }, [unreadCount]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        // Mark as read
        await markRead(notification._id);

        // Navigate if link exists, with notification ID for highlighting
        if (notification.link) {
            const url = new URL(notification.link, window.location.origin);
            url.searchParams.set('notificationId', notification._id);
            navigate(url.pathname + url.search);
        }

        setIsOpen(false);
    };

    const handleMarkAllRead = async () => {
        await markAllRead();
        setIsOpen(false);
    };

    return (
        <div className={`relative ${isRinging ? 'ringing' : ''}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full hover:text-gold-400 hover:bg-navy-800 transition-colors focus:outline-none bell-ring-container ${unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}
            >
                <Bell className="h-6 w-6 animate-bell-shake" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full min-w-[16px]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed left-4 right-4 top-20 w-auto md:absolute md:right-0 md:left-auto md:top-full md:mt-2 md:w-80 bg-navy-800 border border-navy-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-navy-700 flex justify-between items-center bg-navy-900">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-navy-700 scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="px-4 py-3">
                                <NotificationSkeleton />
                            </div>
                        ) : unreadCount === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-400 text-sm">No new notifications</div>
                        ) : (
                            <ul className="divide-y divide-navy-700">
                                {visibleNotifications.map((notification) => (
                                    <li
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className="px-4 py-3 hover:bg-navy-700 transition-colors cursor-pointer bg-navy-700/30"
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <p className="text-sm text-white font-medium">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <span className="h-2 w-2 bg-gold-400 rounded-full mt-1.5 flex-shrink-0 ml-2"></span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
