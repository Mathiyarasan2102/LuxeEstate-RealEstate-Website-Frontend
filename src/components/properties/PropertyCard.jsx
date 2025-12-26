import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="card overflow-hidden group"
        >
            <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
                <img
                    src={property.coverImage || property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-navy-900/80 backdrop-blur text-gold-400 px-3 py-1 rounded-full text-sm font-semibold">
                    ₹{property.price.toLocaleString('en-IN')}
                </div>
                <div className="absolute top-4 left-4 bg-gold-400 text-navy-900 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {property.propertyType}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-serif font-bold text-cream mb-2 line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin size={16} className="mr-1 text-gold-400" />
                    <span className="truncate">
                        {property.location?.city}, {property.location?.country}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-navy-700 pt-4 text-gray-300 text-sm">
                <div className="flex items-center gap-1">
                    <BedDouble size={18} className="text-gold-400" />
                    <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1">
                    <Bath size={18} className="text-gold-400" />
                    <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-1">
                    <Square size={18} className="text-gold-400" />
                    <span>{property.areaSqft} sqft</span>
                </div>
            </div>

            <Link
                to={`/properties/${property.slug}`}
                className="block w-full text-center mt-6 py-2 border border-gold-400 text-gold-400 rounded hover:bg-gold-400 hover:text-navy-900 transition-colors"
            >
                View Details
            </Link>
        </motion.div>
    );
};

export default PropertyCard;
