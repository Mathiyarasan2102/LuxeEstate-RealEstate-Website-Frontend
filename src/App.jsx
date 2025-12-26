import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ToastProvider from './components/common/ToastProvider';
import AppRoutes from './routes/AppRoutes';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const App = () => {
    return (
        <>
            <ScrollToTop />
            <ToastProvider />
            <AppRoutes />
        </>
    );
};

export default App;

