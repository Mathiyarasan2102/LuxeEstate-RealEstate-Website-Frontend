import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { apiSlice } from '../store/apiSlice';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize socket
        // Note: import.meta.env.VITE_API_URL might include '/api', we need base URL
        // Assuming VITE_API_URL is 'http://localhost:5000/api' or just 'http://localhost:5000'
        // Ideally should be just host. 
        // For safe measure, we can use window.location.hostname if local, or explicit env.
        // Let's assume http://localhost:5000 for now or derive from existing config logic.

        const socketUrl = 'http://localhost:5000';

        const newSocket = io(socketUrl, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        // Debug connection
        newSocket.on('connect', () => {
            console.log('Socket client connected:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => newSocket.close();
    }, []);

    // Request Notification Permission
    useEffect(() => {
        if (user && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [user]);

    useEffect(() => {
        if (socket && user) {
            socket.emit('join_room', user._id);
            if (user.role) {
                socket.emit('join_role', user.role);
            }

            // Define handler
            const handleNotification = (notification) => {
                // Determine toast type
                const type = notification.type || 'info';

                // Check user preference
                if (user?.receivePushNotifications !== false) {
                    if (toast[type]) {
                        toast[type](notification.message);
                    } else {
                        toast.info(notification.message);
                    }

                    // Send System Notification (Outside Browser)
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification(notification.title || 'LuxeEstate Alert', {
                            body: notification.message,
                        });
                    }
                }

                // Invalidate RTK Query cache to refetch notifications list
                dispatch(apiSlice.util.invalidateTags(['Notifications']));
            };

            // Listen for notifications
            socket.on('receive_notification', handleNotification);

            return () => {
                socket.off('receive_notification', handleNotification);
            }
        }
    }, [socket, user, dispatch]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
