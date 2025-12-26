import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../store/usersApiSlice';
import { logOut } from '../../store/authSlice';
import { Menu, X, LogOut, User } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import UserAvatar from '../common/UserAvatar';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(logOut());
            navigate('/login');
            setIsOpen(false);
        }
    };

    // Show welcome toast for agents (once per user)
    React.useEffect(() => {
        if (user && user.role === 'agent') {
            const hasSeenWelcome = localStorage.getItem(`agent_welcome_shown_${user._id}`);
            if (!hasSeenWelcome) {
                toast.success("Congratulations! You are now an authorized Agent.", {
                    duration: 5000,
                    icon: '🎉'
                });
                localStorage.setItem(`agent_welcome_shown_${user._id}`, 'true');
            }
        }
    }, [user]);

    return (
        <nav className="bg-navy-900 border-b border-navy-800 sticky top-0 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-gold-400 font-serif text-2xl font-bold">LuxeEstate</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links - Only show on large screens */}
                    <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 px-4">
                        <Link to="/" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                        <Link to="/properties" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Properties</Link>
                        <Link to="/about" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
                        {user?.role === 'admin' ? (
                            <Link to="/admin/dashboard" className="text-gold-400 hover:text-gold-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Admin Dashboard
                            </Link>
                        ) : user?.role === 'agent' ? (
                            <Link to="/seller/dashboard" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gold-400/90">
                                Seller Dashboard
                            </Link>
                        ) : user?.role === 'user' ? (
                            <Link to="/seller/dashboard" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gold-400/90">
                                Become a Seller
                            </Link>
                        ) : !user ? (
                            <Link to="/register?isSeller=true" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gold-400/90">
                                Seller
                            </Link>
                        ) : null}
                    </div>

                    {/* Right: User Actions - Hide on mobile, show on large screens */}
                    <div className="hidden lg:flex lg:items-center">
                        {user ? (
                            <div className="ml-3 relative flex items-center">
                                <NotificationDropdown />
                                <div className="h-6 w-px bg-navy-700 mx-4"></div>

                                <Link to="/dashboard" className="hidden md:block text-cream text-sm hover:text-gold-400 transition-colors mr-3">Welcome, {user.name}</Link>

                                <Link to="/dashboard">
                                    <UserAvatar
                                        user={user}
                                        className="h-8 w-8"
                                        textSize="text-sm"
                                        borderWidth="border"
                                    />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-cream hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign In</Link>
                                <Link to="/register" className="bg-gold-400 text-navy-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gold-500 transition-colors shadow-lg hover:shadow-gold-400/20">Register</Link>
                            </div>
                        )}
                    </div>
                    {/* Mobile Menu Button - Show on medium and small screens */}
                    <div className="-mr-2 flex items-center gap-2 lg:hidden">
                        {/* Notification Bell for Mobile - Only for logged-in users */}
                        {user && (
                            <div className="lg:hidden">
                                <NotificationDropdown />
                            </div>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-navy-700 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu - Show on medium and small screens */}
            {isOpen && (
                <div className="lg:hidden bg-navy-800 border-t border-navy-700 absolute w-full left-0">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-navy-700">Home</Link>
                        <Link to="/properties" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Properties</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">About</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Contact</Link>
                        {!user && (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Sign In</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Register</Link>
                                <Link to="/register?isSeller=true" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Seller</Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">My Dashboard</Link>

                                {user.role === 'user' && (
                                    <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gold-400 hover:text-white hover:bg-navy-700">
                                        Become a Seller
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
