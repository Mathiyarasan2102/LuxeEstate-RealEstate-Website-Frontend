import React from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import NotFound from './NotFound';

const AuthPage = () => {
    const location = useLocation();
    const { authMode } = useParams();

    // Validate route - only allow 'login' or 'register'
    // This allows us to use a single dynamic route /:authMode to keep the component mounted for animations
    if (authMode && !['login', 'register'].includes(authMode)) {
        return <NotFound />;
    }

    // Determine rotation based on path.
    // /login -> 0deg (show Login front)
    // /register -> 180deg (show Register back)
    const isRegister = location.pathname.includes('/register');
    const rotateValue = isRegister ? 180 : 0;

    return (
        <Layout>
            {/* Removed overflow-hidden to allow scrolling if card expands, and switched to margin-auto centering for safer vertical alignment */}
            <div className="min-h-[calc(100vh-64px)] py-6 px-4 flex bg-navy-900 perspective-1000">
                <div style={{ perspective: '1000px' }} className="w-full max-w-md h-[850px] m-auto">
                    {/* Card Container */}
                    <motion.div
                        className="relative w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial={{ rotateY: rotateValue }}
                        animate={{ rotateY: rotateValue }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* Front Face (Login) */}
                        <div
                            className="absolute inset-0 w-full h-full flex items-start justify-center pt-16"
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                        >
                            <LoginForm />
                        </div>

                        {/* Back Face (Register) */}
                        <div
                            className="absolute inset-0 w-full h-full flex items-start justify-center pt-16"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }}
                        >
                            <RegisterForm />
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default AuthPage;
