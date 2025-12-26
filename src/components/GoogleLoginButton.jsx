import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleLoginMutation } from '../store/usersApiSlice';
import { setCredentials } from '../store/authSlice';
import toast from 'react-hot-toast';

const GoogleLoginButton = ({ text = "Continue with Google", className = "", id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [googleLogin] = useGoogleLoginMutation();
    const initializedRef = React.useRef(false);

    // Generate a unique ID if one isn't provided (Memoized to prevent re-renders)
    const buttonId = React.useMemo(() => id || `google-btn-${Math.random().toString(36).substr(2, 9)}`, [id]);

    useEffect(() => {
        // 1. Critical Environment Check
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
            console.error('CRITICAL: VITE_GOOGLE_CLIENT_ID is not defined in import.meta.env. Google Sign-In will not work.');
            return;
        }

        // 2. Prevent Double Initialization (React StrictMode safe)
        if (initializedRef.current) return;

        // Function to render the button
        const renderGoogleButton = () => {
            if (window.google && window.google.accounts) {
                // Initialize only if not already done by another component
                // internal state checks might be needed but typically initialize is safe to call if client_id matches
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleCallback
                });

                const element = document.getElementById(buttonId);
                if (element) {
                    window.google.accounts.id.renderButton(
                        element,
                        { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular' }
                    );
                    initializedRef.current = true;
                }
            }
        };

        // 3. Singleton Script Loading
        const scriptUrl = 'https://accounts.google.com/gsi/client';
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

        if (existingScript) {
            // Script already exists, just wait for it to load if it hasn't
            if (window.google) {
                renderGoogleButton();
            } else {
                existingScript.addEventListener('load', renderGoogleButton);
                return () => existingScript.removeEventListener('load', renderGoogleButton);
            }
        } else {
            // Load the script
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.async = true;
            script.defer = true;
            script.onload = renderGoogleButton;
            document.body.appendChild(script);
        }

        // Cleanup not strictly necessary for the script tag itself as we want it to persist,
        // but we assume other cleanup isn't needed for the global google object
    }, [buttonId]); // Dependency on buttonId ensures re-render if ID changes, though rare

    const handleGoogleCallback = async (response) => {
        try {
            const res = await googleLogin({ credential: response.credential }).unwrap();
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    avatar: res.avatar,
                    role: res.role,
                    authProviders: res.authProviders
                },
                token: res.token
            }));
            if (res.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
            toast.success('Login Successful');
        } catch (err) {
            console.error('Google Auth Error:', err);
            toast.error(err?.data?.message || err.error || 'Google Login Failed');
        }
    };

    // Check for client ID and return null if missing (logging is done in useEffect)
    // DEBUG: Log all env variables to see what's happening
    // console.log('Current Env Vars:', import.meta.env); 

    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        // Fallback or just return null
        return null;
    }

    return (
        <div className={`w-full ${className}`}>
            <div id={buttonId} className="w-full flex justify-center"></div>
        </div>
    );
};

export default GoogleLoginButton;
