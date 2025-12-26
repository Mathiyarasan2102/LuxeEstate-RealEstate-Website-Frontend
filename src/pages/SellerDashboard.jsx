import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Home, BarChart2, Briefcase, Loader, ShieldCheck, Mail, CheckCircle, Smartphone, ArrowLeft, TrendingUp, Grid,
    User, Bell, Settings, LogOut, ChevronDown, XCircle, AlertCircle, Search, Eye, EyeOff, ArrowRight, Menu, X
} from 'lucide-react';
import {
    useGetAgentPropertiesQuery,
    useDeletePropertyMutation,
} from '../store/propertiesApiSlice';
import { useGetAgentInquiriesQuery, useUpdatePropertyInquiryStatusMutation } from '../store/inquiriesApiSlice';
import { useApplyForSellerMutation, useUpdateUserMutation, useGetUserProfileQuery } from '../store/usersApiSlice';

import { setCredentials, logOut } from '../store/authSlice';
import AnimatedPage from '../components/ui/AnimatedPage';
import { AnimatedGrid, AnimatedItem } from '../components/ui/AnimatedGrid';
import PropertyCard from '../components/Seller/PropertyCard';
import StatsCard from '../components/Seller/StatsCard';
import UserAvatar from '../components/common/UserAvatar';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Skeleton, PropertyCardSkeleton, DashboardSkeleton } from '../components/ui/Skeletons';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    highlighted: {
        opacity: 1,
        y: 0,
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 0.6, delay: 0.5, ease: "easeInOut" }
        }
    }
};

const UpgradeToAgent = () => {
    const { user } = useSelector((state) => state.auth);
    const [applyForSeller, { isLoading }] = useApplyForSellerMutation();
    const { data: userProfile } = useGetUserProfileQuery(undefined, {
        pollingInterval: 1000, // Poll every 1s
        refetchOnMountOrArgChange: true,
        skip: !user
    });
    const dispatch = useDispatch();

    // Sync Redux state if profile changes (e.g. approved as agent)
    React.useEffect(() => {
        if (userProfile && JSON.stringify(userProfile) !== JSON.stringify(user)) {
            // Only update if meaningful changes (role, status)
            if (userProfile.role !== user.role || userProfile.sellerApplicationStatus !== user.sellerApplicationStatus) {
                // We need token to use setCredentials. Ideally store it in Redux or grab from LS
                // Since we are inside the component, we assume user is logged in.
                // We'll dispatch a profile update action if available, or just setCredentials with existing token logic
                // For now, simpler to just use the new status for rendering locally.
                // BUT if role changed to 'agent', we want the parent to re-render.
                // So we MUST update Redux.
                // Assuming token is in localStorage for this patch or we can't update.
                // If token is missing, we might logout. Safe fallback:
                const token = user.token || localStorage.getItem('jwt'); // 'userInfo' might contain token in LS?
                // Let's just rely on local state 'userProfile' for rendering status here.
                // If APPROVED, we need to reload or dispatch.
                if (userProfile.role === 'agent') {
                    window.location.reload(); // Simplest way to resync everything for now
                }
            }
        }
    }, [userProfile, user]);

    // Use profile data if available, else Redux (stale) data
    const currentStatus = userProfile?.sellerApplicationStatus || user?.sellerApplicationStatus;
    const isRejected = currentStatus === 'rejected';
    const isPending = currentStatus === 'pending';
    const rejectionReason = userProfile?.rejectionReason || user?.rejectionReason;

    const handleUpgrade = async () => {
        try {
            const res = await applyForSeller().unwrap();

            // Update auth state with new user data (which has status: 'pending')
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    sellerApplicationStatus: res.sellerApplicationStatus,
                    avatar: res.avatar,
                    receivePushNotifications: res.receivePushNotifications,
                    authProviders: res.authProviders || res.authProviders // Ensure strict mapping
                },
                token: res.token
            }));
            // We can assume user is already logged in, so we just need to update the user object in Redux.

            toast.success("Application submitted successfully!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to apply.");
        }
    };

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-navy-800 p-8 rounded-2xl border border-navy-700 shadow-xl max-w-lg w-full">
                    <div className="w-20 h-20 bg-gold-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader className="text-gold-400 animate-spin-slow" size={40} />
                    </div>
                    <h1 className="text-3xl font-serif text-cream mb-4">Application Under Review</h1>
                    <p className="text-gray-400 mb-6">
                        Thanks for your interest in becoming a LuxeEstate Agent.
                        Our team is currently reviewing your profile. You will receive a notification once approved.
                    </p>
                    <div className="bg-navy-900 rounded-lg p-4 text-sm text-gray-400 border border-navy-800">
                        <p>Status: <span className="text-gold-400 font-bold uppercase tracking-wider">Pending Approval</span></p>
                    </div>
                    <Link
                        to="/"
                        className="mt-6 inline-block bg-navy-800 border border-gold-400 text-gold-400 px-8 py-3 rounded-lg font-bold hover:bg-gold-400 hover:text-navy-900 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (isRejected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle size={64} className="text-red-500 mb-6" />
                <h1 className="text-4xl font-serif text-cream mb-4">Application Rejected</h1>
                <p className="text-gray-400 max-w-lg mb-8">
                    Unfortunately, your application to become an agent was not approved at this time.
                </p>
                {rejectionReason && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-6 max-w-lg w-full">
                        <p className="text-red-300 text-sm font-bold uppercase tracking-wide mb-1">Reason for Rejection</p>
                        <p className="text-gray-300 text-sm">{rejectionReason}</p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="bg-navy-800 border border-gold-400 text-gold-400 px-8 py-3 rounded-lg font-bold hover:bg-gold-400 hover:text-navy-900 transition-colors w-full sm:w-auto"
                    >
                        {isLoading ? 'Re-applying...' : 'Re-apply Now'}
                    </button>
                    <Link
                        to="/"
                        className="bg-navy-800 border border-navy-700 text-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-navy-700 hover:text-white transition-colors w-full sm:w-auto text-center"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <ShieldCheck size={64} className="text-gold-400 mb-6" />
            <h1 className="text-4xl font-serif text-cream mb-4">Become a LuxeEstate Agent</h1>
            <p className="text-gray-400 max-w-lg mb-8">
                Unlock the ability to list your own properties, manage leads, and access detailed analytics.
                Join our exclusive network of premium real estate agents.
            </p>
            <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="bg-gold-400 text-navy-950 px-8 py-3 rounded-lg font-bold hover:bg-gold-300 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : 'Apply Now'}
            </button>
            <Link
                to="/"
                className="mt-4 inline-block bg-navy-800 border border-navy-700 text-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-navy-700 hover:text-white transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
};

const tabConfig = {
    overview: { title: 'Dashboard Overview', subtitle: 'View your activity and performance at a glance.' },
    listings: { title: 'My Properties', subtitle: 'Manage and track your property listings.' },
    inquiries: { title: 'Inquiries', subtitle: 'Review messages from potential buyers.' },
    analytics: { title: 'Analytics', subtitle: 'Track your performance and engagement.' },
    profile: { title: 'Agent Profile', subtitle: 'Manage your account settings and personal information.' }
};

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const prevPendingInquiriesRef = React.useRef(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const notificationId = searchParams.get('notificationId');

    // Helper to update URL params and sync with local storage for preference persistence
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
        localStorage.setItem('sellerDashboardTab', tab);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    const [name, setName] = useState(user?.name || '');
    const [updateUser, { isLoading: isUpdatingProfile }] = useUpdateUserMutation();

    React.useEffect(() => {
        setName(user?.name || '');
    }, [user?.name]);

    const handleSaveProfile = async () => {
        try {
            const res = await updateUser({ name }).unwrap();

            // Construct user object and token explicitly for setCredentials
            // The authSlice expects { user, token } structure
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    avatar: res.avatar,
                    receivePushNotifications: res.receivePushNotifications,
                    authProviders: res.authProviders
                },
                token: res.token
            }));

            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update profile');
        }
    };

    const handleNotificationToggle = async () => {
        // Request Permission
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        try {
            const res = await updateUser({
                receivePushNotifications: !user?.receivePushNotifications
            }).unwrap();
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    avatar: res.avatar,
                    receivePushNotifications: res.receivePushNotifications,
                    authProviders: res.authProviders
                },
                token: res.token
            }));
            toast.success(`Notifications ${res.receivePushNotifications ? 'enabled' : 'disabled'}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update notification settings");
        }
    };

    // Fetch real data
    const {
        data: realProperties,
        isLoading: isPropertiesLoading,
        refetch
    } = useGetAgentPropertiesQuery(undefined, {
        skip: !user || user.role !== 'agent',
        pollingInterval: 1000,
        refetchOnMountOrArgChange: true
    });

    const {
        data: realInquiries,
        isLoading: isInquiriesLoading
    } = useGetAgentInquiriesQuery(undefined, {
        skip: !user || user.role !== 'agent',
        pollingInterval: 1000,
        refetchOnMountOrArgChange: true
    });

    const properties = realProperties || [];
    const inquiries = realInquiries || [];

    // Scroll to highlighted inquiry
    const pendingInquiries = inquiries?.filter(inq => inq.status === 'pending').length || 0;

    // Trigger bell ringing animation when new inquiries arrive
    React.useEffect(() => {
        // Initialize ref on first render
        if (prevPendingInquiriesRef.current === 0 && pendingInquiries > 0) {
            prevPendingInquiriesRef.current = pendingInquiries;
            return;
        }

        // Trigger animation when count increases
        if (pendingInquiries > prevPendingInquiriesRef.current) {
            console.log('🔔 Seller Bell ringing triggered! Previous:', prevPendingInquiriesRef.current, 'Current:', pendingInquiries);
            setIsRinging(true);
            const timer = setTimeout(() => {
                setIsRinging(false);
                console.log('🔕 Seller Bell ringing stopped');
            }, 3000);
            return () => clearTimeout(timer);
        }

        prevPendingInquiriesRef.current = pendingInquiries;
    }, [pendingInquiries]);

    const [highlightId, setHighlightId] = useState(null);

    React.useEffect(() => {
        if (highlightId && inquiries && activeTab === 'inquiries') {
            const timer = setTimeout(() => {
                const element = document.getElementById(`inquiry-${highlightId}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const isInViewport = (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    );

                    if (!isInViewport) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [highlightId, inquiries, activeTab]);

    // Handle notification highlighting and scrolling
    React.useEffect(() => {
        if (notificationId) {
            setTimeout(() => {
                // Try multiple possible ID formats
                const possibleIds = [
                    `notification-${notificationId}`,
                    `inquiry-${notificationId}`,
                    `property-${notificationId}`,
                    notificationId
                ];

                let element = null;
                for (const id of possibleIds) {
                    element = document.getElementById(id);
                    if (element) break;
                }

                if (element) {
                    // Scroll to element
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Add highlight class
                    element.classList.add('notification-highlight');

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        element.classList.remove('notification-highlight');
                    }, 3000);
                }
            }, 500);
        }
    }, [notificationId]);

    // Note: We bypass loading states for demo user to show data immediately
    const isLoading = isPropertiesLoading || isInquiriesLoading;

    const [deleteProperty] = useDeletePropertyMutation();
    const [updateInquiryStatus] = useUpdatePropertyInquiryStatusMutation();
    const handleReplyClick = async (e, inquiry) => {
        // Auto-mark as reviewed if pending
        if (inquiry.status === 'pending') {
            try {
                // Non-await to allow immediate navigation
                updateInquiryStatus({ id: inquiry._id, status: 'reviewed' }).unwrap()
                    .then(() => toast.success('Marked as reviewed'))
                    .catch(err => console.error('Status update failed', err));
            } catch (err) {
                console.error('Failed to initiate update', err);
            }
        }
    };

    // Click Outside Handler
    const notificationRef = React.useRef(null);
    const profileRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isNotificationsOpen || isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationsOpen, isProfileOpen]);

    if (!user) return null;

    if (user.role !== 'agent' && user.role !== 'admin') {
        return (
            <AnimatedPage className="container mx-auto px-4 py-8">
                <UpgradeToAgent />
            </AnimatedPage>
        );
    }

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateUserPassword, { isLoading: isUpdating }] = useUpdateUserMutation();

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            toast.error("Please enter your current password");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            await updateUserPassword({
                name: user.name,
                email: user.email,
                password: newPassword,
                oldPassword: currentPassword
            }).unwrap();

            toast.success("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update password");
        }
    };

    const handleDelete = (id) => {
        setPropertyToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            await deleteProperty(propertyToDelete).unwrap();
            toast.success('Property deleted');
            refetch();
            setPropertyToDelete(null);
        } catch (err) {
            toast.error(err?.data?.message || 'Delete failed');
        }
    };

    const handleMarkAsRead = async (id, currentStatus) => {
        if (currentStatus !== 'pending') return;

        try {
            await updateInquiryStatus({ id, status: 'reviewed' }).unwrap();
            toast.success('Marked as read');
            if (highlightId === id) setHighlightId(null);
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleLogout = async () => {
        try {
            dispatch(logOut());
            navigate('/auth/login');
        } catch (err) {
            console.error(err);
            navigate('/auth/login');
        }
    };

    // Filter properties based on search
    const filteredProperties = properties?.filter(property =>
        property.title.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    // Calculate Stats
    const totalListings = properties?.length || 0;
    const totalViews = properties?.reduce((acc, curr) => acc + (curr.stats?.views || 0), 0) || 0;
    const totalInquiries = inquiries?.length || 0;

    // Dummy Analytics Data (Derived from actual count but distributed for chart)
    const analyticsData = [
        { name: 'Mon', views: Math.floor(totalViews * 0.1) || 0, inquiries: Math.floor(totalInquiries * 0.1) || 0 },
        { name: 'Tue', views: Math.floor(totalViews * 0.15) || 0, inquiries: Math.floor(totalInquiries * 0.05) || 0 },
        { name: 'Wed', views: Math.floor(totalViews * 0.2) || 0, inquiries: Math.floor(totalInquiries * 0.2) || 0 },
        { name: 'Thu', views: Math.floor(totalViews * 0.1) || 0, inquiries: Math.floor(totalInquiries * 0.15) || 0 },
        { name: 'Fri', views: Math.floor(totalViews * 0.25) || 0, inquiries: Math.floor(totalInquiries * 0.3) || 0 },
        { name: 'Sat', views: Math.floor(totalViews * 0.15) || 0, inquiries: Math.floor(totalInquiries * 0.1) || 0 },
        { name: 'Sun', views: Math.floor(totalViews * 0.05) || 0, inquiries: Math.floor(totalInquiries * 0.1) || 0 },
    ];

    // --- Main Layout ---

    return (
        <div className="flex h-screen bg-navy-950 font-sans text-gray-100 overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 bg-navy-900 border-r border-navy-800 flex flex-col transition-transform duration-300 transform 
                    md:relative md:translate-x-0 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-6 border-b border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gold-400 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="text-navy-900 h-5 w-5" />
                        </div>
                        <span className="text-xl font-serif text-white tracking-wide">Luxe<span className="text-gold-400">Agent</span></span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-navy-700">
                    {[
                        { id: 'overview', label: 'Overview', icon: Grid },
                        { id: 'listings', label: 'My Listings', icon: Home },
                        { id: 'inquiries', label: 'Inquiries', icon: Mail },
                        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${activeTab === item.id
                                    ? 'bg-gold-400 text-navy-900 shadow-lg shadow-gold-400/20 font-medium'
                                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-navy-900' : 'group-hover:text-gold-400'} />
                            <span>{item.label}</span>
                            {item.id === 'inquiries' && pendingInquiries > 0 && activeTab !== 'inquiries' && (
                                <span className="ml-auto bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingInquiries}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-navy-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header (Sticky, Notifications & Profile Only) */}
                <header className="h-20 bg-navy-900/80 backdrop-blur-md border-b border-navy-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 w-full">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-gray-400 hover:text-gold-400 hover:bg-navy-800 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="text-xl font-serif text-white tracking-wide">Luxe<span className="text-gold-400">Agent</span></span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 ml-auto">

                        {/* Notifications */}
                        <div className={`relative ${isRinging ? 'ringing' : ''}`} ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 rounded-full text-gray-400 hover:text-gold-400 transition-colors hover:bg-navy-800 focus:outline-none bell-ring-container"
                            >
                                <Bell className="h-6 w-6 animate-bell-shake" />
                                {pendingInquiries > 0 && (
                                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full min-w-[16px]">
                                        {pendingInquiries > 99 ? '99+' : pendingInquiries}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="fixed top-20 left-4 right-4 md:absolute md:inset-auto md:left-0 lg:left-auto lg:right-0 md:mt-2 md:w-72 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl z-30 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-navy-700 flex justify-between items-center">
                                            <h3 className="font-semibold text-white">Notifications</h3>
                                            {pendingInquiries > 0 && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded mr-1">{pendingInquiries} New</span>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-navy-700 scrollbar-track-transparent">
                                            {pendingInquiries === 0 ? (
                                                <div className="p-8 text-center text-gray-400">
                                                    <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                                                    <p>All caught up!</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-navy-700">
                                                    {inquiries?.filter(i => i.status === 'pending').map(inq => (
                                                        <div key={inq._id} onClick={() => { setActiveTab('inquiries'); setIsNotificationsOpen(false); setHighlightId(inq._id); }} className="p-4 hover:bg-navy-700/50 cursor-pointer transition-colors group">
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                                    <Mail size={16} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-white line-clamp-1">{inq.subject}</p>
                                                                    <p className="text-xs text-gray-400 mt-1 break-all">From: {inq.userId?.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-6 w-px bg-navy-800 mx-2 hidden md:block"></div>

                        {/* Agent Badge & Profile Dropdown */}
                        <div className="flex items-center gap-4">
                            <span className="hidden md:inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold tracking-wider shadow-sm shadow-blue-400/5">
                                AGENT
                            </span>


                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 p-1 rounded-full group hover:bg-navy-800 transition-colors"
                                >
                                    <div className="h-9 w-9 rounded-full ring-2 ring-transparent group-hover:ring-gold-400 transition-all">
                                        <UserAvatar
                                            user={user}
                                            className="h-full w-full"
                                            textSize="text-sm"
                                        />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">{user?.name || 'Agent'}</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-48 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl z-30 overflow-hidden"
                                        >
                                            <div className="p-2 space-y-1">
                                                <button
                                                    onClick={() => { setActiveTab('profile'); setIsProfileOpen(false); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-navy-700 transition-colors"
                                                >
                                                    <User size={16} /> Profile
                                                </button>
                                                <button
                                                    onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-navy-700 transition-colors"
                                                >
                                                    <Settings size={16} /> Account Settings
                                                </button>
                                                <div className="h-px bg-navy-700 my-1"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <h2 className="text-3xl font-serif text-white capitalize">{tabConfig[activeTab]?.title}</h2>
                            <p className="text-gray-400 text-sm mt-1">{tabConfig[activeTab]?.subtitle}</p>
                        </header>
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    {isPropertiesLoading || isInquiriesLoading ? (
                                        <DashboardSkeleton />
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <StatsCard title="Total Listings" value={totalListings} icon={Home} trend={5} />
                                                <StatsCard title="Total Views" value={totalViews} icon={BarChart2} trend={12} />
                                                <StatsCard title="Total Inquiries" value={totalInquiries} icon={Briefcase} trend={8} />
                                            </div>

                                            {/* Recent Activity / Inquiries Preview */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                <div className="bg-navy-800/50 backdrop-blur border border-navy-700 p-6 rounded-2xl">
                                                    <h3 className="text-xl font-serif text-cream mb-4">Recent Inquiries</h3>
                                                    {inquiries?.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {inquiries.slice(0, 3).map(inquiry => (
                                                                <div key={inquiry._id} className="flex items-start gap-3 p-3 bg-navy-900/50 rounded-lg hover:bg-navy-800 transition-colors">
                                                                    <div className={`mt-1 w-2 h-2 rounded-full ${inquiry.status === 'pending' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                                                    <div>
                                                                        <p className="text-cream font-bold text-sm">{inquiry.userId?.name}</p>
                                                                        <p className="text-xs text-gray-400 mb-1">on {inquiry.propertyId?.title}</p>
                                                                        <p className="text-xs text-gray-300 line-clamp-1 italic">"{inquiry.message}"</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button onClick={() => setActiveTab('inquiries')} className="text-gold-400 text-sm hover:underline mt-2">View All Inquiries</button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">No recent inquiries.</p>
                                                    )}
                                                </div>

                                                <div className="bg-navy-800/50 backdrop-blur border border-navy-700 p-4 sm:p-6 rounded-2xl">
                                                    <h3 className="text-lg font-bold text-cream mb-4 flex items-center gap-2"><Briefcase size={18} className="text-gold-400" /> Pro Tips</h3>
                                                    <ul className="space-y-3 text-gray-400 text-sm">
                                                        <li className="flex gap-3"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5 shadow-[0_0_10px_#fbbf24] flex-shrink-0"></div> Properties with high-quality photos get 3x more views and 2x more inquiries.</li>
                                                        <li className="flex gap-3"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5 shadow-[0_0_10px_#fbbf24] flex-shrink-0"></div> Responding to inquiries within 1 hour significantly increases your conversion rate.</li>
                                                        <li className="flex gap-3"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5 shadow-[0_0_10px_#fbbf24] flex-shrink-0"></div> Add detailed descriptions and local amenities to improve search visibility.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {
                                activeTab === 'listings' && (
                                    <motion.div
                                        key="listings"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="relative flex-1 sm:w-64">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search properties..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full bg-navy-900 border border-navy-700 text-cream pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-gold-400 text-sm placeholder-gray-500 transition-colors"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => navigate('/seller/add-property')}
                                                    className="flex items-center gap-2 bg-gold-400 text-navy-950 px-4 py-2 rounded-lg font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 text-sm whitespace-nowrap"
                                                >
                                                    <Plus size={18} /> Add Property
                                                </button>
                                            </div>
                                        </div>

                                        {isPropertiesLoading ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {[1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)}
                                            </div>
                                        ) : filteredProperties?.length === 0 ? (
                                            <div className="text-center py-12 bg-navy-800/50 backdrop-blur rounded-2xl border border-navy-700">
                                                <Home size={48} className="mx-auto text-navy-600 mb-4" />
                                                <h3 className="text-xl text-cream mb-2">No properties found</h3>
                                                <p className="text-gray-400 mb-6">
                                                    {searchTerm ? 'Try adjusting your search terms.' : 'Create your first listing to get started.'}
                                                </p>
                                                {!searchTerm && (
                                                    <button onClick={() => navigate('/seller/add-property')} className="text-gold-400 hover:underline">
                                                        Create Listing
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredProperties.map(property => (
                                                    <AnimatedItem key={property._id}>
                                                        <PropertyCard property={property} onDelete={handleDelete} />
                                                    </AnimatedItem>
                                                ))}
                                            </AnimatedGrid>
                                        )}
                                    </motion.div>
                                )
                            }

                            {
                                activeTab === 'inquiries' && (
                                    <motion.div
                                        key="inquiries"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {pendingInquiries > 0 && (
                                            <div className="flex justify-end mb-6">
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                    {pendingInquiries} New
                                                </span>
                                            </div>
                                        )}

                                        {isInquiriesLoading ? (
                                            <div className="space-y-4">
                                                <Skeleton className="h-32 w-full rounded-xl" />
                                                <Skeleton className="h-32 w-full rounded-xl" />
                                                <Skeleton className="h-32 w-full rounded-xl" />
                                            </div>
                                        ) : inquiries?.length === 0 ? (
                                            <div className="text-center py-12 bg-navy-800/50 backdrop-blur rounded-2xl border border-navy-700">
                                                <Briefcase size={48} className="mx-auto text-navy-600 mb-4" />
                                                <h3 className="text-xl text-cream mb-2">No inquiries yet</h3>
                                                <p className="text-gray-400">When users contact you about a property, they will appear here.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {inquiries.map((inquiry) => (
                                                    <motion.div
                                                        id={`inquiry-${inquiry._id}`}
                                                        key={inquiry._id}
                                                        variants={itemVariants}
                                                        animate={highlightId === inquiry._id ? "highlighted" : "visible"}
                                                        className={`p-6 rounded-xl border transition-all duration-300 relative overflow-hidden backdrop-blur-sm
                                                ${inquiry.status === 'pending' ? 'bg-navy-800 border-gold-400/50 shadow-lg shadow-gold-400/5' : 'bg-navy-800/50 border-navy-700'}
                                                ${highlightId === inquiry._id ? 'ring-2 ring-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : ''}
                                            `}
                                                    >
                                                        {inquiry.status === 'pending' && (
                                                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-3 animate-pulse"></div>
                                                        )}
                                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-cream flex items-center gap-2">
                                                                    {inquiry.propertyId?.title || 'Unknown Property'}
                                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${inquiry.status === 'pending' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
                                                                        }`}>
                                                                        {inquiry.status}
                                                                    </span>
                                                                </h4>
                                                                <div className="flex items-center text-sm text-gold-400 mt-1">
                                                                    <Mail size={14} className="mr-1" />
                                                                    {inquiry.userId?.email}
                                                                    <span className="mx-2 text-navy-600">|</span>
                                                                    <span className="text-gray-400">From: {inquiry.userId?.name}</span>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-gray-500 bg-navy-900 px-3 py-1 rounded border border-navy-800 whitespace-nowrap">
                                                                {new Date(inquiry.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="bg-navy-900/50 p-4 rounded-lg border border-navy-800 mb-4">
                                                            <p className="text-gray-300 italic">"{inquiry.message}"</p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3">
                                                            <a
                                                                href={`mailto:${inquiry.userId?.email}?subject=${encodeURIComponent(`Re: Inquiry for ${inquiry.propertyId?.title || 'Property'}`)}`}
                                                                onClick={(e) => handleReplyClick(e, inquiry)}
                                                                className="btn-primary-sm flex items-center gap-2 bg-gold-400 text-navy-900 px-4 py-2 rounded font-bold hover:bg-gold-300 transition-transform hover:scale-105"
                                                            >
                                                                <Mail size={16} /> Reply via Email
                                                            </a>
                                                            {inquiry.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleMarkAsRead(inquiry._id, inquiry.status)}
                                                                    className="flex items-center gap-2 bg-navy-700 text-cream px-4 py-2 rounded hover:bg-navy-600 transition-colors border border-navy-600"
                                                                >
                                                                    <CheckCircle size={16} /> Mark as Read
                                                                </button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            }

                            {
                                activeTab === 'analytics' && (
                                    <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {isPropertiesLoading ? (
                                            <div className="space-y-8">
                                                <Skeleton className="h-[400px] w-full rounded-2xl" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Skeleton className="h-64 w-full rounded-2xl" />
                                                    <Skeleton className="h-64 w-full rounded-2xl" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="bg-navy-800/50 backdrop-blur p-4 sm:p-6 rounded-2xl border border-navy-700 mb-8">
                                                    <h2 className="text-xl font-serif text-cream mb-6">Traffic & Engagement</h2>
                                                    <div className="w-full" style={{ height: '320px' }}>
                                                        <ResponsiveContainer width="100%" height={320}>
                                                            <BarChart data={analyticsData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                                                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                                                <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                                                <Tooltip
                                                                    content={({ active, payload, label }) => {
                                                                        if (active && payload && payload.length) {
                                                                            return (
                                                                                <div className="bg-navy-900/90 backdrop-blur border border-navy-700 p-3 rounded-lg shadow-xl">
                                                                                    <p className="text-cream font-medium mb-1 border-b border-navy-700 pb-1">{label}</p>
                                                                                    {payload.map((entry, index) => (
                                                                                        <p key={index} className="text-xs font-medium flex items-center justify-between gap-4" style={{ color: entry.color || entry.fill }}>
                                                                                            <span>{entry.name === 'views' ? 'Property Views' : entry.name === 'inquiries' ? 'Inquiries' : entry.name}</span>
                                                                                            <span className="font-bold">{entry.value}</span>
                                                                                        </p>
                                                                                    ))}
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    }}
                                                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                                                />
                                                                <Bar dataKey="views" name="Property Views" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                                                <Bar dataKey="inquiries" name="Inquiries" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                    <div className="bg-navy-800/50 backdrop-blur p-4 sm:p-6 rounded-2xl border border-navy-700">
                                                        <h3 className="text-lg font-bold text-cream mb-4">Top Performing Properties</h3>
                                                        <div className="space-y-4">
                                                            {[...properties || []].sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0)).slice(0, 3).map((property, idx) => (
                                                                <div key={property._id} className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg hover:bg-navy-800 transition-colors">
                                                                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                                                                        <div className="w-8 h-8 rounded-full bg-gold-400 text-navy-900 flex items-center justify-center font-bold shadow-lg flex-shrink-0">
                                                                            {idx + 1}
                                                                        </div>
                                                                        <span className="text-cream font-medium truncate">{property.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-gold-400 font-medium flex-shrink-0">
                                                                        <BarChart2 size={14} /> {property.stats?.views || 0}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-navy-800/50 backdrop-blur p-4 sm:p-6 rounded-2xl border border-navy-700">
                                                        <h3 className="text-lg font-bold text-cream mb-4 flex items-center gap-2"><Briefcase size={18} className="text-gold-400" /> Pro Tips</h3>
                                                        <ul className="space-y-3 text-gray-400 text-sm">
                                                            <li className="flex gap-3"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5 shadow-[0_0_10px_#fbbf24] flex-shrink-0"></div> Properties with high-quality photos get 3x more views and 2x more inquiries.</li>
                                                            <li className="flex gap-3"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5 shadow-[0_0_10px_#fbbf24] flex-shrink-0"></div> Responding to inquiries within 1 hour significantly increases your conversion rate.</li>
                                                            <li className="flex gap-3"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5 shadow-[0_0_10px_#fbbf24] flex-shrink-0"></div> Add detailed descriptions and local amenities to improve search visibility.</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )
                            }

                            {
                                activeTab === 'profile' && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="max-w-2xl"
                                    >
                                        <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-4 sm:p-8 shadow-xl">
                                            <h2 className="text-xl font-serif text-cream mb-6 text-center md:text-left">Agent Profile Settings</h2>

                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="flex-shrink-0 flex flex-col items-center">
                                                    <div className="mb-4 relative shadow-2xl rounded-full">
                                                        <UserAvatar
                                                            user={user}
                                                            className="h-32 w-32"
                                                            textSize="text-5xl"
                                                        />
                                                    </div>
                                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase rounded-full border border-blue-500/20">
                                                        AGENT
                                                    </span>
                                                </div>

                                                <div className="flex-1 space-y-6">
                                                    <div>
                                                        <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            autoComplete="off"
                                                            className="w-full bg-navy-900 border border-navy-800 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors placeholder-gray-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                                                        <input
                                                            type="text"
                                                            value={user?.email || ''}
                                                            disabled
                                                            className="w-full bg-navy-900/50 border border-navy-800 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                                                        />
                                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                            <ShieldCheck size={12} className="flex-shrink-0" />
                                                            <span>Email cannot be changed by agent.</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-6 mt-6 border-t border-navy-800">
                                                        <button
                                                            onClick={handleSaveProfile}
                                                            disabled={isUpdatingProfile || name.trim() === user?.name}
                                                            className="bg-gold-400 text-navy-950 px-8 py-3 rounded-lg font-bold hover:bg-gold-300 transition-colors shadow-md shadow-gold-400/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none w-full md:w-auto"
                                                        >
                                                            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }

                            {
                                activeTab === 'settings' && (
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="max-w-2xl"
                                    >
                                        <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-4 sm:p-8 shadow-xl">
                                            <h3 className="text-xl font-serif text-white mb-6 text-center md:text-left">Account Settings</h3>

                                            <div className="space-y-6">
                                                {/* Push Notification Toggle */}
                                                <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-navy-700">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                                                        <div className="p-2 bg-gold-400/10 rounded-lg text-gold-400 flex-shrink-0">
                                                            <Bell size={20} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-white font-medium break-words">Push Notifications</h4>
                                                            <p className="text-xs text-gray-400 mt-0.5">Receive alerts for new inquiries and listings</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={user?.receivePushNotifications ?? true}
                                                            onChange={handleNotificationToggle}
                                                            disabled={isUpdatingProfile}
                                                        />
                                                        <div className="w-11 h-6 bg-navy-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-400"></div>
                                                    </label>
                                                </div>

                                                <div className="h-px bg-navy-700 my-4"></div>



                                                {/* Change Password Section */}
                                                <div>
                                                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                                        <ShieldCheck size={18} className="text-gold-400" /> Security
                                                    </h4>
                                                    {(!user?.authProviders?.google || user?.authProviders?.local) ? (
                                                        <form className="space-y-4" onSubmit={handlePasswordChange} noValidate>
                                                            {/* Hidden username field for accessibility/password managers */}
                                                            <input
                                                                type="text"
                                                                name="username"
                                                                autoComplete="username"
                                                                value={user?.email || ''}
                                                                readOnly
                                                                className="hidden"
                                                            />
                                                            <div>
                                                                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                                                                <div className="relative">
                                                                    <input
                                                                        type={showCurrentPassword ? "text" : "password"}
                                                                        className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors pr-10"
                                                                        placeholder="Enter current password"
                                                                        value={currentPassword}
                                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                                        autoComplete="current-password"
                                                                        required
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors"
                                                                    >
                                                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm text-gray-400 mb-1">New Password</label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type={showNewPassword ? "text" : "password"}
                                                                            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors pr-10"
                                                                            placeholder="Enter new password"
                                                                            value={newPassword}
                                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                                            autoComplete="new-password"
                                                                            required
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors"
                                                                        >
                                                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type="password"
                                                                            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                                                                            placeholder="Confirm new password"
                                                                            value={confirmPassword}
                                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                                            autoComplete="new-password"
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="pt-2 flex justify-end">
                                                                <button
                                                                    type="submit"
                                                                    disabled={isUpdatingProfile || !currentPassword || !newPassword || !confirmPassword}
                                                                    className="bg-navy-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-600 border border-navy-600 hover:border-gold-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                                                                >
                                                                    {isUpdatingProfile ? 'Updating...' : 'Update Password'}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div className="bg-navy-900/50 p-8 rounded-xl border border-navy-700 text-center">
                                                            <div className="inline-flex items-center justify-center p-3 bg-navy-800 rounded-full mb-4 border border-navy-600">
                                                                <ShieldCheck className="text-gold-400" size={32} />
                                                            </div>
                                                            <h5 className="text-white font-serif text-lg mb-2">Google Secure Login</h5>
                                                            <p className="text-gray-400 max-w-sm mx-auto mb-4">
                                                                You signed in securely via Google. You don't need a separate password for LuxeEstate.
                                                            </p>
                                                            <a
                                                                href="https://myaccount.google.com/security"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gold-400 hover:text-gold-300 text-sm font-medium hover:underline inline-flex items-center gap-1"
                                                            >
                                                                Manage Google Security <ArrowRight size={14} />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence >
                    </div >
                </main >
            </div >

            <ConfirmationModal
                isOpen={!!propertyToDelete}
                onClose={() => setPropertyToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default SellerDashboard;
