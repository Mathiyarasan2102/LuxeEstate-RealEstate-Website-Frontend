import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Home, MessageSquare, TrendingUp,
    Trash2, CheckCircle, XCircle, Edit, Shield,
    Search, Filter, Mail, Phone, Calendar,
    Grid, Bell, Settings, LogOut, Menu, ChevronRight, User, ChevronDown, AlertCircle, Eye, EyeOff, ArrowRight, X
} from 'lucide-react';
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useUpdateUserMutation,
    useRejectSellerApplicationMutation,
} from '../store/usersApiSlice';
import {
    useGetAdminPropertiesQuery,
    useUpdatePropertyMutation,
    useDeletePropertyMutation
} from '../store/propertiesApiSlice';
import { useGetContactInquiriesQuery, useUpdateInquiryStatusMutation } from '../store/contactApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, setCredentials } from '../store/authSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserAvatar from '../components/common/UserAvatar';

import { Skeleton, PropertyCardSkeleton } from '../components/ui/Skeletons';

// --- Sub Components (Defined Outside) ---

const StatCard = ({ label, value, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-navy-800/50 backdrop-blur-md border border-navy-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-gold-500/30 transition-all duration-300"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
            <Icon size={80} />
        </div>
        <div className="relative z-10">
            <div className={`p-3 rounded-xl w-fit mb-4 ${colorClass} bg-opacity-20`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            <h3 className="text-4xl font-serif text-white mb-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        </div>
    </motion.div>
);

const OverviewTab = ({ totalUsers, totalProperties, pendingListings, totalInquiries, users, properties, inquiries, setActiveTab }) => {

    // Aggregate and sort activities
    const activities = [
        ...(users || []).map(u => ({ type: 'user', data: u, date: new Date(u.createdAt) })),
        ...(properties || []).map(p => ({ type: 'property', data: p, date: new Date(p.createdAt) })),
        ...(inquiries || []).map(i => ({ type: 'inquiry', data: i, date: new Date(i.createdAt) }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value={totalUsers} icon={Users} colorClass="text-blue-400 bg-blue-400" delay={0.1} />
                <StatCard label="Properties" value={totalProperties} icon={Home} colorClass="text-gold-400 bg-gold-400" delay={0.2} />
                <StatCard label="Pending" value={pendingListings} icon={CheckCircle} colorClass="text-orange-400 bg-orange-400" delay={0.3} />
                <StatCard label="Inquiries" value={totalInquiries} icon={MessageSquare} colorClass="text-emerald-400 bg-emerald-400" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-6"
                >
                    <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-gold-400" size={20} /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {activities.length > 0 ? activities.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 hover:bg-navy-700/30 rounded-lg transition-colors">
                                <div className={`w-2 h-2 rounded-full ${item.type === 'user' ? 'bg-blue-400' :
                                    item.type === 'property' ? 'bg-gold-400' : 'bg-emerald-400'
                                    }`}></div>
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        {item.type === 'user' && <>New user joined: <span className="text-white">{item.data.name}</span></>}
                                        {item.type === 'property' && <>New property listed: <span className="text-white">{item.data.title?.substring(0, 20)}...</span></>}
                                        {item.type === 'inquiry' && <>New inquiry from: <span className="text-white">{item.data.name}</span></>}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">{getTimeAgo(item.date)}</span>
                            </div>
                        )) : (
                            <div className="text-gray-500 text-sm italic p-2">No recent activity</div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-6"
                >
                    <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                        <Shield className="text-gold-400" size={20} /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveTab('properties')} className="p-4 bg-navy-900 rounded-xl border border-navy-700 hover:border-gold-400/50 hover:bg-navy-800 transition-all text-left group">
                            <CheckCircle className="mb-3 text-gray-400 group-hover:text-gold-400 transition-colors" />
                            <span className="text-gray-300 group-hover:text-white text-sm font-medium">Review Listings</span>
                        </button>
                        <button onClick={() => setActiveTab('users')} className="p-4 bg-navy-900 rounded-xl border border-navy-700 hover:border-gold-400/50 hover:bg-navy-800 transition-all text-left group">
                            <Users className="mb-3 text-gray-400 group-hover:text-gold-400 transition-colors" />
                            <span className="text-gray-300 group-hover:text-white text-sm font-medium">Manage Users</span>
                        </button>
                        <button onClick={() => setActiveTab('inquiries')} className="p-4 bg-navy-900 rounded-xl border border-navy-700 hover:border-gold-400/50 hover:bg-navy-800 transition-all text-left group">
                            <MessageSquare className="mb-3 text-gray-400 group-hover:text-gold-400 transition-colors" />
                            <span className="text-gray-300 group-hover:text-white text-sm font-medium">Check Inquiries</span>
                        </button>
                        <button onClick={() => setActiveTab('settings')} className="p-4 bg-navy-900 rounded-xl border border-navy-700 hover:border-gold-400/50 hover:bg-navy-800 transition-all text-left group">
                            <Settings className="mb-3 text-gray-400 group-hover:text-gold-400 transition-colors" />
                            <span className="text-gray-300 group-hover:text-white text-sm font-medium">Account Settings</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const UsersTab = ({ users, handleDeleteUser, handleRoleUpdate, handleRejectSeller }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users
        ?.filter(user => {
            const term = searchTerm.toLowerCase().trim();
            if (!term) return true;
            return (user.name?.toLowerCase().startsWith(term) ||
                user.email?.toLowerCase().startsWith(term));
        })
        .sort((a, b) => {
            // Sort pending agent applications to the top
            const aPending = a.sellerApplicationStatus === 'pending' ? 1 : 0;
            const bPending = b.sellerApplicationStatus === 'pending' ? 1 : 0;
            return bPending - aPending;
        });

    return (
        <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-navy-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-serif text-white">User Management</h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-navy-900 text-white pl-10 pr-4 py-2 rounded-lg border border-navy-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-navy-900/50 text-gray-400 text-xs uppercase tracking-wider font-medium">
                        <tr>
                            <th className="px-6 py-4">User Details</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700/50">
                        {filteredUsers?.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <UserAvatar
                                                user={user}
                                                className="h-10 w-10"
                                                textSize="text-lg"
                                            />
                                            <div>
                                                <div className="font-medium text-white group-hover:text-gold-400 transition-colors">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${user.role === 'admin' ? 'bg-gold-500/10 text-gold-400 border-gold-500/20' :
                                            user.role === 'agent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                        {user.sellerApplicationStatus === 'pending' && (
                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wide">
                                                Pending Agent
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-green-400 text-xs flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.sellerApplicationStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleRoleUpdate(user._id, 'agent')}
                                                        className="text-green-400 hover:text-green-300 p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                                                        title="Approve Agent Application"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectSeller(user._id)}
                                                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Reject Agent Application"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user._id, user.role)}
                                                className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No users found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PropertiesTab = ({ properties, handlePropertyStatus, handleDeleteProperty, onReject }) => (
    <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-navy-700">
            <h3 className="text-xl font-serif text-white">Property Listings</h3>
            <p className="text-gray-400 text-sm mt-1">Review and manage all property submissions</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-navy-900/50 text-gray-400 text-xs uppercase tracking-wider font-medium">
                    <tr>
                        <th className="px-6 py-4">Property</th>
                        <th className="px-6 py-4">Agent</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/50">
                    {properties?.map((property) => (
                        <tr key={property._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={property.coverImage || property.images?.[0] || 'https://via.placeholder.com/150'}
                                        alt=""
                                        className="h-16 w-24 object-cover rounded-lg border border-navy-700"
                                    />
                                    <div>
                                        <div className="font-medium text-white truncate max-w-[200px]">{property.title}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Home size={10} /> {property.location?.city || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">{property.agentId?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{property.agentId?.email}</div>
                            </td>
                            <td className="px-6 py-4 text-white font-medium font-serif">
                                <span className="font-sans">₹</span>{property.price?.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${property.approvalStatus === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    property.approvalStatus === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                    }`}>
                                    {property.approvalStatus === 'approved' && <CheckCircle size={10} className="mr-1" />}
                                    {property.approvalStatus === 'pending' && <Calendar size={10} className="mr-1" />}
                                    <span className="capitalize">{property.approvalStatus}</span>
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {property.approvalStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handlePropertyStatus(property._id, 'approved')}
                                                className="text-green-400 hover:text-green-300 p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                                                title="Approve Listing"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => onReject(property._id)}
                                                className="text-orange-400 hover:text-orange-300 p-2 hover:bg-orange-500/10 rounded-lg transition-colors"
                                                title="Reject Listing"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDeleteProperty(property._id)}
                                        className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Property"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const RejectionModal = ({ isOpen, onClose, onSubmit, reason, setReason }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-navy-800 border border-navy-700 p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
                <h3 className="text-xl font-serif text-white mb-4">Reject Listing</h3>
                <p className="text-gray-400 mb-4 text-sm">Please provide a reason for rejecting this listing. This will be visible to the seller.</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-white focus:border-gold-400 focus:outline-none min-h-[100px] mb-6"
                    placeholder="e.g., Images are blurry, Price seems incorrect..."
                    autoFocus
                />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">Cancel</button>
                    <button onClick={onSubmit} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">Reject Listing</button>
                </div>
            </motion.div>
        </div>
    );
};

const InquiriesTab = ({ inquiries }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inquiries?.length === 0 ? (
            <div className="col-span-full bg-navy-800/50 rounded-2xl p-12 text-center text-gray-400 border border-navy-700">
                <Mail size={48} className="mx-auto mb-4 opacity-20" />
                <p>No inquiries received yet.</p>
            </div>
        ) : (
            inquiries?.map((inquiry) => (
                <div key={inquiry._id} className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-6 hover:border-gold-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <UserAvatar
                                user={{ name: inquiry.name }}
                                className="h-10 w-10 shrink-0"
                                textSize="text-lg"
                            />
                            <div className="min-w-0">
                                <h4 className="text-white font-medium truncate pr-2">{inquiry.subject}</h4>
                                <p className="text-xs text-gray-400 break-all">{inquiry.name} • {inquiry.email}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-navy-900 px-2 py-1 rounded shrink-0 ml-2 whitespace-nowrap">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="bg-navy-900/50 p-4 rounded-xl text-gray-300 text-sm border border-navy-800 group-hover:bg-navy-900 transition-colors">
                        "{inquiry.message}"
                    </div>
                    <div className="mt-4 flex gap-2 justify-end">
                        <a href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`} className="text-xs flex items-center gap-1 text-gold-400 hover:underline">
                            <Mail size={12} /> Reply via Email
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(inquiry.email);
                                toast.success('Email ID copied to clipboard!');
                            }}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-gold-400 transition-colors"
                        >
                            <Mail size={12} /> Copy Email
                        </button>
                    </div>
                </div>
            ))
        )}
    </div>
);

// ... imports kept as is
// ... (keep previous code)

const AdminProfileTab = ({ user }) => {
    // Local state for basic profile editing
    const [name, setName] = useState(user?.name || '');
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const dispatch = useDispatch();

    // Real Update Handler
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUser({ name, email: user.email }).unwrap();
            dispatch(setCredentials({
                user: {
                    ...user, // Keep existing fields like roles
                    name: res.name,
                    email: res.email,
                    authProviders: res.authProviders
                },
                token: localStorage.getItem('token') // Keep existing token
            }));
            toast.success('Admin profile updated successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || 'Failed to update profile');
        }
    };

    // Notification Toggle
    const handleNotificationToggle = async () => {
        // Explicitly request permission
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        try {
            const res = await updateUser({
                receivePushNotifications: !user?.receivePushNotifications
            }).unwrap();

            dispatch(setCredentials({
                user: {
                    ...user,
                    name: res.name,
                    email: res.email,
                    role: res.role, // role might not be in response from profile update usually but safe to keep
                    avatar: res.avatar,
                    receivePushNotifications: res.receivePushNotifications,
                    authProviders: res.authProviders
                },
                token: localStorage.getItem('token')
            }));

            toast.success(`Notifications ${res.receivePushNotifications ? 'enabled' : 'disabled'}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        }
    };

    return (
        <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-8 max-w-2xl">
            <h3 className="text-xl font-serif text-white mb-6">Admin Profile Settings</h3>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="mb-4 relative shadow-2xl rounded-full">
                        <UserAvatar
                            user={user}
                            className="h-32 w-32"
                            textSize="text-5xl"
                        />
                    </div>
                    <span className="px-3 py-1 bg-gold-400/20 text-gold-400 text-xs font-bold uppercase rounded-full border border-gold-400/30">
                        ADMIN
                    </span>
                </div>

                <form className="flex-1 w-full space-y-6" onSubmit={handleUpdate}>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-navy-900/50 border border-navy-800 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Shield size={12} /> Email cannot be changed by admin.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Notifications</label>
                        <div className="flex items-center gap-3 p-3 bg-navy-900 rounded-lg border border-navy-700">
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                <input
                                    type="checkbox"
                                    id="admin-notif-toggle"
                                    className="peer absolute opacity-0 w-0 h-0"
                                    checked={user?.receivePushNotifications ?? true}
                                    onChange={handleNotificationToggle}
                                />
                                <label
                                    htmlFor="admin-notif-toggle"
                                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${user?.receivePushNotifications ? 'bg-gold-500' : 'bg-gray-600'}`}
                                ></label>
                                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${user?.receivePushNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-gray-300 text-sm">Enable System Notifications</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-navy-700">
                        <button
                            type="submit"
                            disabled={isLoading || name.trim() === user?.name}
                            className="bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-lg hover:bg-gold-500 transition-colors shadow-md shadow-gold-400/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const notificationId = searchParams.get('notificationId');

    // Handle notification highlighting and scrolling
    React.useEffect(() => {
        if (notificationId) {
            setTimeout(() => {
                // Try multiple possible ID formats
                const possibleIds = [
                    `notification-${notificationId}`,
                    `inquiry-${notificationId}`,
                    `property-${notificationId}`,
                    `user-${notificationId}`,
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

    // Wrapper to update URL params instead of local state
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const prevNotificationCountRef = React.useRef(0);


    // Persistent State for Red Dot Logic
    const [lastViewedNotificationCount, setLastViewedNotificationCount] = useState(() => {
        return parseInt(localStorage.getItem('adminLastViewedNotificationCount')) || 0;
    });

    // Persistent State for "New Users" logic (since "new" is relative to what we've seen)
    const [lastSeenUserCount, setLastSeenUserCount] = useState(() => {
        return parseInt(localStorage.getItem('adminLastSeenUserCount')) || 0;
    });

    const notificationRef = React.useRef(null);
    const profileRef = React.useRef(null);

    // Data Fetching
    const { data: users, isLoading: usersLoading } = useGetUsersQuery(undefined, {
        pollingInterval: 1000,
        refetchOnMountOrArgChange: true
    });
    const { data: properties, isLoading: propsLoading } = useGetAdminPropertiesQuery(undefined, {
        pollingInterval: 1000,
        refetchOnMountOrArgChange: true
    });
    const { data: inquiries, isLoading: inqsLoading } = useGetContactInquiriesQuery(undefined, {
        pollingInterval: 1000,
        refetchOnMountOrArgChange: true
    });

    // Stats Logic
    const totalUsers = users?.length || 0;
    const totalProperties = properties?.length || 0;
    // const activeListings = properties?.filter(p => p.approvalStatus === 'approved').length || 0;

    // Notification Metrics
    const pendingListings = properties?.filter(p => p.approvalStatus === 'pending').length || 0;
    const totalInquiries = inquiries?.length || 0;
    const unreadInquiries = inquiries?.filter(i => i.status === 'new').length || 0;
    const newUsersCount = Math.max(0, totalUsers - lastSeenUserCount);

    const totalNotifications = pendingListings + unreadInquiries + newUsersCount;

    // Persist State Changes
    React.useEffect(() => {
        localStorage.setItem('adminLastViewedNotificationCount', lastViewedNotificationCount);
    }, [lastViewedNotificationCount]);

    React.useEffect(() => {
        localStorage.setItem('adminLastSeenUserCount', lastSeenUserCount);
    }, [lastSeenUserCount]);

    // Red Dot Logic: Show if current total > last viewed OR if there are any pending items that haven't been resolved?
    // Actually, widespread pattern: Red dot if Unread Count > 0. 
    // Here we use the detailed counts. If (totalNotifications > 0 && totalNotifications !== lastViewedNotificationCount)
    // But simpliest: Show dot if there is anything demanding attention that we haven't "cleared" via the bell click?
    // Let's stick to the previous 'lastViewed' pattern for the Bell Dot.
    const showRedDot = totalNotifications > 0 && (totalNotifications !== lastViewedNotificationCount);

    // Bell ringing animation when notifications increase
    React.useEffect(() => {
        // Skip on initial load (when ref is 0)
        if (prevNotificationCountRef.current === 0 && totalNotifications > 0) {
            prevNotificationCountRef.current = totalNotifications;
            return;
        }

        // Trigger animation when count increases
        if (totalNotifications > prevNotificationCountRef.current) {
            console.log('🔔 Admin Bell ringing triggered! Previous:', prevNotificationCountRef.current, 'Current:', totalNotifications);
            setIsRinging(true);
            const timer = setTimeout(() => {
                setIsRinging(false);
                console.log('🔕 Admin Bell ringing stopped');
            }, 3000);
            return () => clearTimeout(timer);
        }

        prevNotificationCountRef.current = totalNotifications;
    }, [totalNotifications]);

    // Toggle Notification Handler
    const handleNotificationClick = () => {
        if (!isNotificationsOpen) {
            setLastViewedNotificationCount(totalNotifications);
        }
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const handleNotificationItemClick = (category) => {
        setActiveTab(category);
        setIsNotificationsOpen(false);

        if (category === 'users') {
            setLastSeenUserCount(totalUsers);
        }
    };

    // Sidebar Tab Click Handler (Dismisses badges for that tab)
    // Sidebar Tab Click Handler
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsSidebarOpen(false); // Close sidebar on mobile when navigating

        if (tabId === 'users') {
            setLastSeenUserCount(totalUsers);
        }
    };

    // Click Outside Handler
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



    // Mutation Hooks
    const [deleteUser] = useDeleteUserMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [rejectSeller] = useRejectSellerApplicationMutation();
    const [updateProperty] = useUpdatePropertyMutation();
    const [deleteProperty] = useDeletePropertyMutation();
    const [updateInquiryStatus] = useUpdateInquiryStatusMutation();

    // Auto-mark inquiries as read when viewing the tab
    React.useEffect(() => {
        if (activeTab === 'inquiries' && inquiries) {
            const unreadItems = inquiries.filter(i => i.status === 'new');
            if (unreadItems.length > 0) {
                unreadItems.forEach(item => {
                    updateInquiryStatus({ id: item._id, status: 'read' })
                        .unwrap()
                        .catch(err => console.error('Failed to update status:', err));
                });
            }
        }
    }, [activeTab, inquiries, updateInquiryStatus]);

    // Handlers
    const handleLogout = () => {
        dispatch(logOut());
        navigate('/');
    };

    // Action Confirmation Modal State
    const [actionModal, setActionModal] = useState({
        isOpen: false,
        type: null, // 'deleteUser' | 'deleteProperty'
        id: null,
        title: '',
        message: ''
    });

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

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
            await updateUser({
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
            const res = await updateUser({
                receivePushNotifications: !user?.receivePushNotifications
            }).unwrap();

            // The authSlice expects { user, token } structure
            // We need to preserve existing user fields that aren't returned or passed?
            // Usually updateUser returns the updated user object.
            // Let's ensure we dispatch correctly.
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

    const openActionModal = (type, id, title, message, role = null) => {
        setActionModal({ isOpen: true, type, id, title, message, role });
    };

    const closeActionModal = () => {
        setActionModal({ ...actionModal, isOpen: false });
    };

    const executeAction = async () => {
        const { type, id, role } = actionModal;
        try {
            if (type === 'deleteUser') {
                await deleteUser(id).unwrap();
                if (role === 'agent') {
                    toast.success('Agent deleted successfully');
                } else {
                    toast.success('User deleted successfully');
                }
            } else if (type === 'deleteProperty') {
                await deleteProperty(id).unwrap();
                toast.success('Property deleted');
            }
            closeActionModal();
        } catch (err) {
            toast.error(err?.data?.message || 'Action failed');
            closeActionModal();
        }
    };

    const handleDeleteUser = (id, role) => {
        openActionModal(
            'deleteUser',
            id,
            'Delete User',
            'Are you sure you want to delete this user? This action cannot be undone.',
            role
        );
    };

    const handleRoleUpdate = async (id, newRole) => {
        try {
            await updateUserRole({ id, role: newRole }).unwrap();
            toast.success(`User role updated to ${newRole}`);
        } catch (err) {
            toast.error('Failed to update role');
        }
    };

    const handleRejectSeller = (id) => {
        openRejectModal(id, 'seller');
    };

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectionTargetId, setRejectionTargetId] = useState(null);
    const [rejectType, setRejectType] = useState('property'); // 'property' | 'seller'

    const openRejectModal = (id, type = 'property') => {
        setRejectionTargetId(id);
        setRejectType(type);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) return toast.error('Please provide a reason for rejection');

        if (rejectType === 'property') {
            await handlePropertyStatus(rejectionTargetId, 'rejected', rejectReason);
        } else if (rejectType === 'seller') {
            try {
                await rejectSeller({ id: rejectionTargetId, reason: rejectReason }).unwrap();
                toast.success("Seller application rejected");
            } catch (err) {
                toast.error("Failed to reject application");
            }
        }
        setIsRejectModalOpen(false);
    };

    const handlePropertyStatus = async (id, status, note = '') => {
        try {
            await updateProperty({ id, approvalStatus: status, adminNote: note }).unwrap();
            toast.success(`Property ${status === 'approved' ? 'approved' : status}`);
        } catch (err) {
            toast.error('Failed to update property status');
        }
    };

    const handleDeleteProperty = (id) => {
        openActionModal(
            'deleteProperty',
            id,
            'Delete Property',
            'Are you sure you want to delete this property permanently?'
        );
    };



    // --- Main Layout ---

    return (
        <div className="flex h-screen bg-navy-950 font-sans text-gray-100 overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-navy-900 border-r border-navy-800 flex flex-col shrink-0 h-full transition-transform duration-300 md:translate-x-0 md:static md:inset-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gold-400 rounded-lg flex items-center justify-center">
                            <Shield className="text-navy-900 h-5 w-5" />
                        </div>
                        <span className="text-xl font-serif text-white tracking-wide">Luxe<span className="text-gold-400">Admin</span></span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-navy-700">
                    {[
                        { id: 'overview', label: 'Overview', icon: Grid },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'properties', label: 'Properties', icon: Home },
                        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${activeTab === item.id
                                    ? 'bg-gold-400 text-navy-900 shadow-lg shadow-gold-400/20 font-medium'
                                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-navy-900' : 'group-hover:text-gold-400'} />
                            <span>{item.label}</span>
                            {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50" />}

                            {/* Badges */}
                            {item.id === 'properties' && pendingListings > 0 && activeTab !== 'properties' && (
                                <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingListings}</span>
                            )}
                            {item.id === 'inquiries' && unreadInquiries > 0 && activeTab !== 'inquiries' && (
                                <span className="ml-auto bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unreadInquiries}</span>
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-navy-900/80 backdrop-blur-md border-b border-navy-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">

                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-400 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="text-lg font-serif text-white tracking-wide">Luxe<span className="text-gold-400">Admin</span></span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 ml-auto">

                        {/* Notifications */}
                        <div className={`relative ${isRinging ? 'ringing' : ''}`} ref={notificationRef}>
                            <button
                                onClick={handleNotificationClick}
                                className="relative p-2 text-gray-400 hover:text-gold-400 transition-colors rounded-full hover:bg-navy-800 bell-ring-container"
                            >
                                <Bell size={20} className="animate-bell-shake" />
                                {(totalNotifications > lastViewedNotificationCount) && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full border-2 border-navy-900">
                                        {(totalNotifications - lastViewedNotificationCount) > 99 ? '99+' : (totalNotifications - lastViewedNotificationCount)}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="fixed top-20 left-4 right-4 w-auto md:absolute md:top-full md:mt-2 md:w-80 md:right-auto md:left-0 lg:left-auto lg:right-0 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-navy-700 flex justify-between items-center">
                                            <h3 className="font-semibold text-white">Notifications</h3>
                                            {totalNotifications > 0 && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded mr-1">
                                                    {totalNotifications} New
                                                </span>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {totalNotifications === 0 ? (
                                                <div className="p-8 text-center text-gray-400">
                                                    <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                                                    <p>All caught up!</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-navy-700">
                                                    {pendingListings > 0 && (
                                                        <div
                                                            onClick={() => handleNotificationItemClick('properties')}
                                                            className="p-4 hover:bg-navy-700/50 cursor-pointer transition-colors group"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                                    <Home size={18} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{pendingListings} Property Request{pendingListings > 1 ? 's' : ''}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">Properties waiting for your approval.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {unreadInquiries > 0 && (
                                                        <div
                                                            onClick={() => handleNotificationItemClick('inquiries')}
                                                            className="p-4 hover:bg-navy-700/50 cursor-pointer transition-colors group"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                                    <MessageSquare size={18} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{unreadInquiries} New Inquir{unreadInquiries > 1 ? 'ies' : 'y'}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">Unread messages from potential buyers.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {newUsersCount > 0 && (
                                                        <div
                                                            onClick={() => handleNotificationItemClick('users')}
                                                            className="p-4 hover:bg-navy-700/50 cursor-pointer transition-colors group"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                                    <Users size={18} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{newUsersCount} New User{newUsersCount > 1 ? 's' : ''}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">New users joined the platform.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-6 w-px bg-navy-800 mx-2 hidden sm:block"></div>

                        {/* Admin Badge & Profile Dropdown */}
                        <div className="flex items-center gap-4">
                            <span className="hidden md:inline-block px-3 py-1 bg-gold-400/10 text-gold-400 border border-gold-400/20 rounded-full text-xs font-bold tracking-wider shadow-sm shadow-gold-400/5">
                                ADMIN
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
                                        <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">{user?.name || 'Admin'}</p>
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

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <h2 className="text-3xl font-serif text-white capitalize">{activeTab}</h2>
                            <p className="text-gray-400 text-sm mt-1">Manage your platform's {activeTab} information.</p>
                        </header>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'overview' && (
                                    <OverviewTab
                                        totalUsers={totalUsers}
                                        totalProperties={totalProperties}
                                        pendingListings={pendingListings}
                                        totalInquiries={totalInquiries}
                                        users={users}
                                        properties={properties}
                                        inquiries={inquiries}
                                        setActiveTab={setActiveTab}
                                    />
                                )}
                                {activeTab === 'users' && (
                                    <UsersTab
                                        users={users}
                                        handleDeleteUser={handleDeleteUser}
                                        handleRoleUpdate={handleRoleUpdate}
                                        handleRejectSeller={handleRejectSeller}
                                    />
                                )}
                                {activeTab === 'properties' && (
                                    <PropertiesTab
                                        properties={properties}
                                        handlePropertyStatus={handlePropertyStatus}
                                        handleDeleteProperty={handleDeleteProperty}
                                        onReject={openRejectModal}
                                    />
                                )}
                                {activeTab === 'inquiries' && (
                                    <InquiriesTab inquiries={inquiries} />
                                )}
                                {activeTab === 'profile' && (
                                    <AdminProfileTab user={user} />
                                )}
                                {activeTab === 'settings' && (
                                    <div className="bg-navy-800/50 backdrop-blur border border-navy-700 rounded-2xl p-8 max-w-2xl">
                                        <h3 className="text-xl font-serif text-white mb-6">Account Settings</h3>

                                        <div className="space-y-6">
                                            {/* Push Notification Toggle */}
                                            <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-navy-700">
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
                                                        disabled={isUpdating}
                                                    />
                                                    <div className="w-11 h-6 bg-navy-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-400"></div>
                                                </label>
                                            </div>

                                            <div className="h-px bg-navy-700 my-4"></div>



                                            {/* Change Password Section */}
                                            <div>
                                                <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                                    <Shield size={18} className="text-gold-400" /> Security
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
                                                                disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
                                                                className="bg-navy-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-600 border border-navy-600 hover:border-gold-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {isUpdating ? 'Updating...' : 'Update Password'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div className="bg-navy-900/50 p-8 rounded-xl border border-navy-700 text-center">
                                                        <div className="inline-flex items-center justify-center p-3 bg-navy-800 rounded-full mb-4 border border-navy-600">
                                                            <Shield className="text-gold-400" size={32} />
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
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Modals */}
                <AnimatePresence>
                    {isRejectModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-navy-800 border border-navy-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                            >
                                <h3 className="text-xl font-serif text-white mb-4">
                                    {rejectType === 'seller' ? 'Reject Application' : 'Reject Property'}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    {rejectType === 'seller'
                                        ? 'Please provide a reason for rejecting this application. This will be sent to the user.'
                                        : 'Please provide a reason for rejecting this listing. This will be sent to the seller.'}
                                </p>
                                <textarea
                                    className="w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold-400 transition-colors h-32 resize-none"
                                    placeholder="Reason for rejection..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setIsRejectModalOpen(false)}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRejectSubmit}
                                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                                    >
                                        {rejectType === 'seller' ? 'Reject Application' : 'Reject Property'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {actionModal.isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-navy-800 border border-navy-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-4 text-white">
                                    <div className="p-3 bg-red-500/20 rounded-full text-red-500">
                                        <AlertCircle size={24} />
                                    </div>
                                    <h3 className="text-xl font-serif">{actionModal.title}</h3>
                                </div>
                                <p className="text-gray-400 mb-6">{actionModal.message}</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeActionModal}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={executeAction}
                                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
