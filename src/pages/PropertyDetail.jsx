import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPropertyQuery } from '../store/propertiesApiSlice';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../store/usersApiSlice';
import Layout from '../components/layout/Layout';
import { MapPin, BedDouble, Bath, Square, ArrowLeft, Send, Heart, School, ShoppingBag, Coffee, Train, Trees, Building2, Phone, Mail, Star, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import UserAvatar from '../components/common/UserAvatar';
import toast from 'react-hot-toast';

import { useCreateInquiryMutation } from '../store/inquiriesApiSlice';
import { PropertyDetailSkeleton } from '../components/ui/Skeletons';

const PropertyDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { data: property, isLoading, error } = useGetPropertyQuery(slug);

    // Wishlist Logic
    const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery(undefined, { skip: !user });
    const [toggleWishlist, { isLoading: isTogglingWishlist }] = useToggleWishlistMutation();

    // Inquiry Logic
    const [createInquiry, { isLoading: isSubmittingInquiry }] = useCreateInquiryMutation();
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    // Check if current property is in wishlist
    const isInWishlist = wishlistData?.some(item => {
        const itemId = item._id || item;
        const propertyId = property?._id;
        return itemId?.toString() === propertyId?.toString();
    }) || false;

    const handleWishlistToggle = async () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!property?._id) {
            console.error('Property ID not available');
            return;
        }

        try {
            await toggleWishlist(property._id).unwrap();
            await refetchWishlist();
            toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (err) {
            console.error('Wishlist toggle error:', err);
            toast.error(err?.data?.message || 'Failed to update wishlist');
        }
    };

    // Image Gallery State
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleInquiry = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to send an inquiry');
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            await createInquiry({
                propertyId: property._id,
                message,
                // Name and email are technically handled by backend via token, 
                // but we include them here if we want to extend the backend to support guest inquiries later
                // or just for consistency if the backend endpoint expected them.
                // Current backend inquiryController uses req.user._id, so these aren't strictly used for auth logic there,
                // but good for form completeness.
            }).unwrap();

            toast.success('Inquiry sent successfully! The agent will contact you soon.');
            setMessage('');
        } catch (err) {
            console.error('Inquiry error:', err);
            toast.error(err?.data?.message || 'Failed to send inquiry');
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === property.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? property.images.length - 1 : prev - 1
        );
    };

    if (isLoading) return <Layout><PropertyDetailSkeleton /></Layout>;
    if (error || !property) return <Layout><div className="text-center py-20 text-red-500">Property not found</div></Layout>;

    return (
        <Layout>
            {/* Hero Image */}
            <div className="relative h-[40vh] sm:h-[50vh] bg-navy-800">
                <img
                    src={property.coverImage || property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 container mx-auto">
                    <Link to="/properties" className="text-cream/80 hover:text-gold-400 flex items-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" /> Back to Listings
                    </Link>
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-cream font-bold mb-2 line-clamp-2">{property.title}</h1>
                            <div className="flex items-center text-base sm:text-lg md:text-xl text-gold-400">
                                <MapPin size={18} className="mr-2 sm:w-6 sm:h-6" />
                                {property.location?.city}, {property.location?.country}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400">
                                ₹{property.price.toLocaleString('en-IN')}
                            </div>
                            <button
                                onClick={() => {
                                    setShowGallery(true);
                                    setCurrentImageIndex(0);
                                }}
                                className="px-3 py-2 sm:px-4 sm:py-2 bg-navy-700 text-cream rounded-lg hover:bg-navy-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                            >
                                View Images ({property.images?.length || 1})
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                disabled={isTogglingWishlist}
                                className={`p-2 sm:p-3 rounded-full transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'bg-navy-700 text-gray-300 hover:text-red-500 hover:bg-navy-600'}`}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <Heart size={24} className="sm:w-7 sm:h-7" fill={isInWishlist ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats - Enhanced with Animations */}
                        <motion.div
                            className="grid grid-cols-3 gap-2 sm:gap-4 bg-navy-800 p-4 sm:p-6 rounded-lg border border-navy-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <motion.div
                                className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg hover:bg-navy-700 transition-colors"
                                whileHover={{ y: -5, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <BedDouble size={24} className="text-gold-400 mb-1 sm:mb-2 sm:w-8 sm:h-8" />
                                </motion.div>
                                <motion.div
                                    className="text-cream text-base sm:text-lg font-bold text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <div className="text-lg sm:text-xl">{property.bedrooms}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">Bedrooms</div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="flex flex-col items-center justify-center p-2 sm:p-4 border-l border-navy-700 rounded-lg hover:bg-navy-700 transition-colors"
                                whileHover={{ y: -5, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <Bath size={24} className="text-gold-400 mb-1 sm:mb-2 sm:w-8 sm:h-8" />
                                </motion.div>
                                <motion.div
                                    className="text-cream text-base sm:text-lg font-bold text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <div className="text-lg sm:text-xl">{property.bathrooms}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">Bathrooms</div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="flex flex-col items-center justify-center p-2 sm:p-4 border-l border-navy-700 rounded-lg hover:bg-navy-700 transition-colors"
                                whileHover={{ y: -5, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <Square size={24} className="text-gold-400 mb-1 sm:mb-2 sm:w-8 sm:h-8" />
                                </motion.div>
                                <motion.div
                                    className="text-cream text-base sm:text-lg font-bold text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    <div className="text-lg sm:text-xl">{property.areaSqft.toLocaleString()}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">sqft</div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Description */}
                        <div className="bg-navy-800 p-8 rounded-lg border border-navy-700">
                            <h2 className="text-2xl font-serif text-cream mb-4">Description</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities - Enhanced with Animations */}
                        <motion.div
                            className="bg-navy-800 p-8 rounded-lg border border-navy-700"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <motion.h2
                                className="text-2xl font-serif text-cream mb-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Amenities
                            </motion.h2>
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {property.amenities?.map((amenity, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center text-gray-300 p-3 rounded-lg hover:bg-navy-700 transition-colors"
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.div
                                            className="w-2 h-2 bg-gold-400 rounded-full mr-3"
                                            whileHover={{ scale: 1.5 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        {amenity}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>


                    </div>

                    {/* Sidebar / Premium Agent Card */}
                    <div className="space-y-8">
                        <motion.div
                            className="bg-navy-800 p-6 rounded-lg border border-navy-700 sticky top-24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.h3
                                className="text-xl font-serif text-cream mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Contact Agent
                            </motion.h3>

                            {/* Agent Profile */}
                            <motion.div
                                className="flex items-center mb-6 pb-6 border-b border-navy-700"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <motion.div
                                    className="mr-4 rounded-full"
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <UserAvatar
                                        user={property.agentId}
                                        className="w-20 h-20"
                                        textSize="text-3xl"
                                    />
                                </motion.div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-cream mb-1">{property.agentId?.name || "LuxeEstate Agent"}</h4>
                                    <p className="text-gold-400 text-sm mb-2">Senior Real Estate Agent</p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">4.9 (120)</span>
                                    </div>
                                </div>
                            </motion.div>


                            {/* Enhanced Inquiry Form */}
                            <motion.form
                                onSubmit={handleInquiry}
                                className="space-y-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <h4 className="text-sm font-semibold text-gray-400 mb-4">Send Message</h4>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        className={`input-field ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        readOnly={!!user}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className={`input-field ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        readOnly={!!user}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        className="input-field"
                                        placeholder="I am interested in this property..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmittingInquiry}
                                    className="w-full btn-primary flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isSubmittingInquiry ? 1 : 1.02, boxShadow: isSubmittingInquiry ? "none" : "0 0 10px rgba(251, 191, 36, 0.2)" }}
                                    whileTap={{ scale: isSubmittingInquiry ? 1 : 0.98 }}
                                >
                                    {isSubmittingInquiry ? 'Sending...' : 'Send Inquiry'} <Send size={18} />
                                </motion.button>

                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Typical response time: <span className="text-gold-400 font-semibold">2 hours</span>
                                </p>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Image Gallery Modal */}
            {showGallery && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowGallery(false)}
                >
                    <div
                        className="relative max-w-5xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gold-400 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image Container */}
                        <div className="relative bg-navy-900 rounded-lg overflow-hidden">
                            <img
                                src={property.images?.[currentImageIndex] || property.coverImage}
                                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                                className="w-full h-[70vh] object-contain"
                            />

                            {/* Navigation Arrows */}
                            {property.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy-800/80 hover:bg-navy-700 text-white p-3 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy-800/80 hover:bg-navy-700 text-white p-3 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy-800/80 text-white px-4 py-2 rounded-full text-sm">
                                {currentImageIndex + 1} / {property.images?.length || 1}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {property.images?.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                {property.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                            ? 'border-gold-400 scale-110'
                                            : 'border-navy-700 hover:border-gold-400/50'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default PropertyDetail;
