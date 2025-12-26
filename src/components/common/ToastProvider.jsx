import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#1e293b',
                    color: '#f5f5dc',
                    border: '1px solid #334155',
                    padding: '16px',
                    borderRadius: '8px',
                },
                success: {
                    iconTheme: {
                        primary: '#fbbf24',
                        secondary: '#1e293b',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#1e293b',
                    },
                },
                loading: {
                    iconTheme: {
                        primary: '#fbbf24',
                        secondary: '#1e293b',
                    },
                },
            }}
        />
    );
};

export default ToastProvider;
