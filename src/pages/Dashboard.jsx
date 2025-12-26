import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { User, Heart, MessageSquare, Settings, LogOut, MapPin, BedDouble, Bath, Square, X, Eye, EyeOff, ShieldCheck, Bell, ArrowRight } from 'lucide-react';
import { useLogoutMutation, useUpdateUserMutation, useGetWishlistQuery, useToggleWishlistMutation } from '../store/usersApiSlice';
import { useGetUserInquiriesQuery } from '../store/inquiriesApiSlice';
import { logOut, setCredentials } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import UserAvatar from '../components/common/UserAvatar';
import { DashboardSkeleton, PropertyCardSkeleton, Skeleton } from '../components/ui/Skeletons';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';
    const highlightId = searchParams.get('highlight');
    const notificationId = searchParams.get('notificationId');

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
    };

    const [logout] = useLogoutMutation();
    // Mutations declared below with aliases
    const { data: wishlistData, isLoading: isWishlistLoading, refetch: refetchWishlist } = useGetWishlistQuery();
    const [toggleWishlist] = useToggleWishlistMutation();

    // Fetch user inquiries only when tab is active
    const { data: inquiriesData, isLoading: isInquiriesLoading } = useGetUserInquiriesQuery(undefined, {
        skip: activeTab !== 'inquiries',
        refetchOnMountOrArgChange: true,
        pollingInterval: 15000
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // STRICT ACCESS CONTROL: Admin -> Admin Dashboard
    React.useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Local state for profile form to avoid "prefilled" lock-in
    const [name, setName] = useState(user?.name || '');

    // Scroll to highlighted element when data loads
    React.useEffect(() => {
        if (highlightId && inquiriesData && activeTab === 'inquiries') {
            // Small timeout to ensure DOM is rendered
            setTimeout(() => {
                const element = document.getElementById(`inquiry-${highlightId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }, [highlightId, inquiriesData, activeTab]);

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

    // Scroll to highlighted element when data loads


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [updateUserProfile, { isLoading: isUpdatingProfile, isSuccess }] = useUpdateUserMutation();
    const [updateUserPassword, { isLoading: isUpdatingPassword }] = useUpdateUserMutation();

    // ... (keep existing useEffects) ...

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUserProfile({ name, email: user.email }).unwrap();
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
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || err.error);
        }
    };

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

    const handleNotificationToggle = async () => {
        try {
            const res = await updateUserProfile({
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

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(logOut());
            navigate('/login');
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        },
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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl"
                    >
                        <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-8 shadow-xl">
                            <h2 className="text-xl font-serif text-cream mb-8">User Profile Settings</h2>

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="mb-4 relative shadow-2xl rounded-full">
                                        <UserAvatar
                                            user={user}
                                            className="h-32 w-32"
                                            textSize="text-5xl"
                                        />
                                    </div>
                                    <span className="px-3 py-1 bg-gray-500/10 text-gray-400 text-xs font-bold uppercase rounded-full border border-gray-500/20">
                                        {user?.role || 'USER'}
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
                                            <ShieldCheck size={12} />
                                            <span>Email cannot be changed by user.</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-navy-800">
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={isUpdatingProfile || name.trim() === user?.name}
                                            className="bg-gold-400 text-navy-950 px-8 py-3 rounded-lg font-bold hover:bg-gold-300 transition-colors shadow-md shadow-gold-400/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                                        >
                                            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        {isSuccess && (
                                            <motion.p
                                                className="text-green-500 text-sm mt-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                Profile updated successfully!
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'wishlist':
                const handleRemoveFromWishlist = async (propertyId) => {
                    try {
                        await toggleWishlist(propertyId).unwrap();
                        refetchWishlist();
                    } catch (err) {
                        console.error(err);
                    }
                };

                return (
                    <motion.div
                        className="bg-navy-800 p-6 rounded-lg border border-navy-700"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="wishlist"
                    >
                        <motion.h2
                            className="text-2xl font-serif text-cream mb-6"
                            variants={itemVariants}
                        >
                            My Wishlist
                        </motion.h2>
                        {
                            isWishlistLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)}
                                </div>
                            ) : !wishlistData || wishlistData?.length === 0 ? (
                                <motion.div
                                    className="text-center py-12"
                                    variants={itemVariants}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <Heart size={48} className="mx-auto text-gray-600 mb-4" />
                                    </motion.div>
                                    <p className="text-gray-400">Your wishlist is empty</p>
                                    <Link to="/properties" className="text-gold-400 hover:text-gold-500 mt-2 inline-block">
                                        Browse Properties
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <AnimatePresence>
                                        {wishlistData?.map((property, index) => (
                                            <motion.div
                                                key={property._id}
                                                className="bg-navy-900 rounded-lg overflow-hidden border border-navy-700 hover:border-gold-400 transition-all relative group"
                                                variants={cardVariants}
                                                layout
                                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                            >
                                                <motion.button
                                                    onClick={() => handleRemoveFromWishlist(property._id)}
                                                    className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                                                    title="Remove from wishlist"
                                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 + 0.3 }}
                                                >
                                                    <X size={16} />
                                                </motion.button>
                                                <Link to={`/properties/${property.slug}`}>
                                                    <motion.img
                                                        src={property.coverImage}
                                                        alt={property.title}
                                                        className="w-full h-48 object-cover"
                                                        initial={{ scale: 1.1 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                        whileHover={{ scale: 1.05 }}
                                                    />
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-bold text-cream mb-2 line-clamp-1">{property.title}</h3>
                                                        <p className="text-gold-400 text-xl font-bold mb-3">₹{property.price.toLocaleString('en-IN')}</p>
                                                        <div className="flex items-center text-gray-400 text-sm gap-4 mb-2">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                {property.location.city}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-gray-400 text-sm gap-4">
                                                            {property.bedrooms > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <BedDouble size={14} />
                                                                    {property.bedrooms}
                                                                </span>
                                                            )}
                                                            {property.bathrooms > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <Bath size={14} />
                                                                    {property.bathrooms}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1">
                                                                <Square size={14} />
                                                                {property.areaSqft.toLocaleString()} sqft
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        }
                    </motion.div >
                );
            case 'inquiries':
                return (
                    <motion.div
                        className="bg-navy-800 p-6 rounded-lg border border-navy-700"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="inquiries"
                    >
                        <motion.h2
                            className="text-2xl font-serif text-cream mb-6"
                            variants={itemVariants}
                        >
                            My Inquiries
                        </motion.h2>

                        {isInquiriesLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-lg" />
                            </div>
                        ) : !inquiriesData || inquiriesData.length === 0 ? (
                            <motion.div
                                className="text-center py-12"
                                variants={itemVariants}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                                </motion.div>
                                <p className="text-gray-400">You haven't sent any inquiries yet.</p>
                                <Link to="/properties" className="text-gold-400 hover:text-gold-500 mt-2 inline-block">
                                    Find a Property
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="space-y-4"
                                variants={staggerContainer}
                            >
                                {inquiriesData.map((inquiry) => (
                                    <motion.div
                                        key={inquiry._id}
                                        id={`inquiry-${inquiry._id}`}
                                        className={`p-4 rounded-lg border transition-all ${highlightId === inquiry._id
                                            ? 'bg-navy-800 border-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                                            : 'bg-navy-900 border-navy-700 hover:border-gold-400'
                                            }`}
                                        variants={itemVariants}
                                        animate={highlightId === inquiry._id ? "highlighted" : "visible"}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-cream">
                                                <Link to={`/properties/${inquiry.propertyId?.slug || ''}`} className="hover:text-gold-400">
                                                    {inquiry.propertyId?.title || 'Property Unavailable'}
                                                </Link>
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${inquiry.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                inquiry.status === 'reviewed' ? 'bg-blue-500/20 text-blue-500' :
                                                    'bg-green-500/20 text-green-500'
                                                }`}>
                                                {inquiry.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3">
                                            Sent on: {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="bg-navy-800 p-3 rounded text-gray-300 italic text-sm border border-navy-700">
                                            "{inquiry.message}"
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div
                        className="bg-navy-800 p-6 rounded-lg border border-navy-700 max-w-2xl"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="settings"
                    >
                        <motion.h2
                            className="text-2xl font-serif text-cream mb-6"
                            variants={itemVariants}
                        >
                            Account Settings
                        </motion.h2>

                        <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
                            {/* Push Notification Toggle */}
                            <motion.div
                                className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-navy-700"
                                variants={itemVariants}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gold-400/10 rounded-lg text-gold-400">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Push Notifications</h4>
                                        <p className="text-xs text-gray-400">Receive alerts for new inquiries and listings</p>
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
                            </motion.div>

                            <div className="h-px bg-navy-700 my-4"></div>

                            {/* Change Password Section */}
                            <motion.div variants={itemVariants}>
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
                                                        placeholder="Re-enter new password"
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
                                                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                                                className="bg-navy-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-600 border border-navy-600 hover:border-gold-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
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
                            </motion.div>
                        </motion.div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <motion.h1
                    className="text-3xl font-serif text-cream mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    Dashboard
                </motion.h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <motion.div
                        className="w-full md:w-64 flex-shrink-0"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
                            <nav className="space-y-2">
                                <motion.button
                                    onClick={() => handleTabChange('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'profile' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <User size={20} /> Profile
                                </motion.button>
                                <motion.button
                                    onClick={() => handleTabChange('wishlist')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'wishlist' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Heart size={20} /> Wishlist
                                </motion.button>
                                <motion.button
                                    onClick={() => handleTabChange('inquiries')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'inquiries' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MessageSquare size={20} /> Inquiries
                                </motion.button>
                                <motion.button
                                    onClick={() => handleTabChange('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'settings' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Settings size={20} /> Account Settings
                                </motion.button>
                                {user?.role === 'admin' && (
                                    <motion.button
                                        onClick={() => navigate('/admin/dashboard')}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded text-gold-400 hover:bg-navy-700 hover:text-gold-300"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Settings size={20} /> Admin Panel
                                    </motion.button>
                                )}
                                <div className="border-t border-navy-700 my-2 pt-2"></div>
                                <motion.button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <LogOut size={20} /> Sign Out
                                </motion.button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="flex-grow"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
