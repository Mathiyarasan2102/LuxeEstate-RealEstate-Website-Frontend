import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader, CheckCircle } from 'lucide-react';
import ImageUploader from '../ui/ImageUploader';

const PROPERTY_TYPES = ['House', 'Apartment', 'Condo', 'Villa', 'Commercial', 'Land'];
const AMENITIES_LIST = [
    'Parking', 'Pool', 'Gym', 'Security', 'Balcony',
    'Garden', 'Elevator', 'Air Conditioning', 'Furnished',
    'Sea View', 'Smart Home'
];

const PropertyForm = ({ initialData, onSubmit, isLoading, isEditMode = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        propertyType: 'House',
        bedrooms: '',
        bathrooms: '',
        areaSqft: '',
        location: {
            formattedAddress: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
        },
        amenities: [],
        images: [],
        coverImage: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                location: initialData.location || { formattedAddress: '', city: '', state: '', zipcode: '', country: '' },
                amenities: initialData.amenities || [],
                images: initialData.images || [],
                coverImage: initialData.coverImage || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const current = prev.amenities || [];
            if (current.includes(amenity)) {
                return { ...prev, amenities: current.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...current, amenity] };
            }
        });
    };

    const handleImagesChange = (newImages) => {
        setFormData(prev => ({
            ...prev,
            images: newImages,
            // Access coverImage if it's not set or needs update
            coverImage: newImages.length > 0 ? newImages[0] : ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Section title="Basic Information">
                <div className="space-y-6">
                    <div>
                        <Label>Property Title</Label>
                        <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Luxury Villa in Beverley Hills" required />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-cream focus:border-gold-400 focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Price ($)</Label>
                            <Input type="number" name="price" value={formData.price} onChange={handleChange} min="0" required />
                        </div>
                        <div>
                            <Label>Property Type</Label>
                            <select
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleChange}
                                className="w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-cream focus:border-gold-400 focus:outline-none transition-colors"
                            >
                                {PROPERTY_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Location */}
            <Section title="Location">
                <div className="space-y-6">
                    <div>
                        <Label>Address</Label>
                        <Input name="location.formattedAddress" value={formData.location.formattedAddress} onChange={handleChange} placeholder="Street Address" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>City</Label>
                            <Input name="location.city" value={formData.location.city} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>State / Province</Label>
                            <Input name="location.state" value={formData.location.state} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Zip Code</Label>
                            <Input name="location.zipcode" value={formData.location.zipcode} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Country</Label>
                            <Input name="location.country" value={formData.location.country} onChange={handleChange} required />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Details */}
            <Section title="Property Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <Label>Bedrooms</Label>
                        <Input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" required />
                    </div>
                    <div>
                        <Label>Bathrooms</Label>
                        <Input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" required />
                    </div>
                    <div>
                        <Label>Area (sqft)</Label>
                        <Input type="number" name="areaSqft" value={formData.areaSqft} onChange={handleChange} min="0" required />
                    </div>
                </div>
            </Section>

            {/* Amenities */}
            <Section title="Amenities">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {AMENITIES_LIST.map(amenity => (
                        <label key={amenity} className="flex items-start space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mt-0.5 flex-shrink-0 
                                ${formData.amenities.includes(amenity) ? 'bg-gold-400 border-gold-400' : 'border-navy-600 group-hover:border-gold-400'}`}>
                                {formData.amenities.includes(amenity) && <CheckCircle size={14} className="text-navy-950" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.amenities.includes(amenity)}
                                onChange={() => handleAmenityToggle(amenity)}
                            />
                            <span className="text-gray-300 group-hover:text-cream transition-colors">{amenity}</span>
                        </label>
                    ))}
                </div>
            </Section>

            {/* Images */}
            <Section title="Property Images">
                <p className="text-sm text-gray-400 mb-4">First image will be used as the cover image.</p>
                <ImageUploader
                    initialImages={formData.images}
                    onImagesChange={handleImagesChange}
                />
            </Section>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-navy-700">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="flex items-center gap-2 bg-gold-400 text-navy-950 px-8 py-3 rounded-lg font-bold hover:bg-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader className="animate-spin" /> : <Save size={20} />}
                    {isEditMode ? 'Update Property' : 'Create Listing'}
                </motion.button>
            </div>
        </form>
    );
};

const Section = ({ title, children }) => (
    <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg">
        <h3 className="text-xl font-serif text-cream mb-6 border-b border-navy-700 pb-2">{title}</h3>
        {children}
    </div>
);

const Label = ({ children }) => (
    <label className="block text-sm font-medium text-gold-400 mb-2">{children}</label>
);

const Input = ({ className = '', ...props }) => (
    <input
        className={`w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-cream focus:border-gold-400 focus:outline-none transition-colors ${className}`}
        {...props}
    />
);

export default PropertyForm;
