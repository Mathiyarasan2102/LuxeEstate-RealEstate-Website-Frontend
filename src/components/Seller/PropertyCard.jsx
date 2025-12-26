import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, BarChart2, Heart, MessageSquare } from 'lucide-react';

const PropertyCard = ({ property, onDelete }) => {
    const statusColors = {
        draft: 'bg-gray-500',
        pending: 'bg-yellow-500',
        approved: 'bg-green-500',
        rejected: 'bg-red-500'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group bg-navy-800 rounded-xl overflow-hidden border border-navy-700 shadow-lg flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={property.coverImage || property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-md ${statusColors[property.approvalStatus] || 'bg-blue-500'}`}>
                        {property.approvalStatus.toUpperCase()}
                    </span>
                    {property.isArchived && (
                        <span className="px-3 py-1 text-xs font-bold text-white bg-slate-600 rounded-full shadow-md">
                            ARCHIVED
                        </span>
                    )}
                </div>

                {/* Overlay actions on hover optional, but let's put main actions below for better UX */}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-cream mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">
                    {property.title}
                </h3>
                <p className="text-gold-400 font-semibold mb-4">
                    ₹{property.price.toLocaleString('en-IN')}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                    <div className="flex items-center gap-1" title="Views">
                        <Eye size={16} /> {property.stats?.views || 0}
                    </div>
                    <div className="flex items-center gap-1" title="Inquiries">
                        <MessageSquare size={16} /> {property.stats?.inquiries || 0}
                    </div>
                    <div className="flex items-center gap-1" title="Wishlists">
                        <Heart size={16} /> {property.stats?.wishlistCount || 0}
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link
                        to={`/seller/edit-property/${property._id}`}
                        className="flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-600 text-cream py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Edit size={16} /> Edit
                    </Link>
                    <button
                        onClick={() => onDelete(property._id)}
                        className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                    {/* Add Stats button later if needed */}
                </div>

                {property.adminNote && property.approvalStatus === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                        <strong>Admin Note:</strong> {property.adminNote}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PropertyCard;
