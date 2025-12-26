import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import { ArrowRight, Search, Home as HomeIcon, Key, Star, CheckCircle, MapPin, BedDouble, Bath, ChevronDown } from 'lucide-react';
import { useGetPropertiesQuery } from '../store/propertiesApiSlice';
import { PropertyCardSkeleton } from '../components/ui/Skeletons';
import { ASSETS } from '../utils/assets';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="text-center p-8 bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 hover:border-gold-400 transition-all duration-300 shadow-xl group"
    >
        <div className="bg-navy-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-navy-700 group-hover:border-gold-400">
            <Icon className="text-gold-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-cream mb-3 group-hover:text-gold-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

const StatCard = ({ number, label }) => (
    <div className="text-center p-6 border-l border-navy-700 first:border-l-0">
        <div className="text-4xl md:text-5xl font-serif font-bold text-gold-400 mb-2">{number}</div>
        <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
);

const Home = () => {
    // Strict Access Control for Admin
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // State for Filter
    const [location, setLocation] = useState('');
    const [priceRange, setPriceRange] = useState('Any Price');
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsPriceDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location.trim()) params.append('search', location);
        if (priceRange !== 'Any Price') params.append('price', priceRange);
        navigate(`/properties?${params.toString()}`);
    };

    // Fetch featured properties (limit 3)
    const { data: propertyData, isLoading: isPropertiesLoading } = useGetPropertiesQuery({ limit: 3 });

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative h-screen min-h-[800px] flex items-center justify-center">
                <div className="absolute inset-0 bg-navy-900 overflow-hidden">
                    <motion.div style={{ y: y1 }} className="absolute inset-0">
                        <img
                            src={ASSETS.HERO_BG}
                            alt="Luxury Home"
                            className="w-full h-full object-cover opacity-60 scale-105"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-transparent to-navy-900/80"></div>
                </div>

                <div className="relative z-20 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-6"
                    >
                        <span className="inline-block py-1 px-3 border border-gold-400 rounded-full text-gold-400 text-sm tracking-widest uppercase mb-6 bg-navy-900/50 backdrop-blur">
                            Award Winning Real Estate
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-serif font-bold text-cream mb-8 leading-tight"
                    >
                        Find Your True <br />
                        <span className="text-gold-400 relative inline-block">
                            Worth
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold-400 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Unlock the door to exclusive properties in the world's most sought-after locations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        {/* Floating Search Bar */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full max-w-3xl mx-auto flex items-center shadow-2xl">
                            <div className="flex-grow px-6 py-2">
                                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1 text-left">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Beverly Hills, CA"
                                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                                />
                            </div>
                            <div className="h-10 w-px bg-white/20 self-center"></div>
                            <div className="flex-grow px-6 py-2 relative" ref={dropdownRef}>
                                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1 text-left">Price Range</label>
                                <button
                                    onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                                    className="w-full bg-transparent text-white text-lg flex items-center justify-between focus:outline-none"
                                >
                                    {priceRange}
                                    <ChevronDown size={16} className={`transition-transform duration-300 ${isPriceDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isPriceDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 right-0 mt-4 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50 text-left"
                                        >
                                            {['Any Price', '₹50L - ₹1Cr', '₹1Cr - ₹5Cr', '₹5Cr+'].map((price) => (
                                                <div
                                                    key={price}
                                                    onClick={() => {
                                                        setPriceRange(price);
                                                        setIsPriceDropdownOpen(false);
                                                    }}
                                                    className={`px-6 py-3 hover:bg-navy-700 cursor-pointer transition-colors text-sm ${priceRange === price ? 'text-gold-400 font-medium' : 'text-gray-300'}`}
                                                >
                                                    {price}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button onClick={handleSearch} className="bg-gold-400 hover:bg-gold-500 text-navy-900 w-14 h-14 rounded-full flex items-center justify-center transition-colors">
                                <Search size={24} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400 text-sm"
                >
                    <span>Scroll to explore</span>
                    <div className="w-px h-16 bg-gradient-to-b from-gold-400 to-transparent mt-4"></div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="bg-navy-900 border-b border-navy-800 relative z-10 -mt-20 mx-4 md:mx-10 rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 bg-navy-800/50 backdrop-blur divide-x divide-navy-700">
                    <StatCard number="250+" label="Premium Listings" />
                    <StatCard number="₹2B+" label="Value Sold" />
                    <StatCard number="1.5k" label="Happy Clients" />
                    <StatCard number="50+" label="Award Wins" />
                </div>
            </section>

            {/* Featured Properties */}
            {(isPropertiesLoading || propertyData?.properties?.length > 0) && (
                <section className="py-24 bg-navy-900 relative">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-gold-400 uppercase tracking-widest text-sm font-semibold mb-2 block">Exclusive Offers</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-cream">Featured Properties</h2>
                            </div>
                            <Link to="/properties" className="hidden md:flex items-center text-gold-400 border-b border-gold-400 pb-1 hover:text-white hover:border-white transition-all">
                                View All Properties <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {isPropertiesLoading ? (
                                [1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)
                            ) : (
                                propertyData.properties.map((property, idx) => (
                                    <Link to={`/properties/${property.slug}`} key={property._id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="group cursor-pointer"
                                        >
                                            <div className="relative h-[400px] overflow-hidden rounded-xl mb-6">
                                                <div className="absolute inset-0 bg-navy-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                                <img
                                                    src={property.coverImage || property.images[0]}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur text-white px-4 py-1 rounded-full text-sm border border-white/20">
                                                    {property.propertyType}
                                                </div>
                                                <div className="absolute bottom-4 right-4 z-20 bg-gold-400 text-navy-900 font-bold px-4 py-2 rounded shadow-lg">
                                                    {property.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif text-cream mb-2 group-hover:text-gold-400 transition-colors">{property.title}</h3>
                                                <div className="flex items-center text-gray-400 mb-4">
                                                    <MapPin size={16} className="mr-1 text-gold-400" />
                                                    {property.location?.city}, {property.location?.country}
                                                </div>
                                                <div className="flex gap-6 text-gray-400 text-sm border-t border-navy-800 pt-4">
                                                    <span className="flex items-center gap-2"><BedDouble size={18} /> {property.bedrooms} Beds</span>
                                                    <span className="flex items-center gap-2"><Bath size={18} /> {property.bathrooms} Baths</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className="py-24 bg-navy-800 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div
                            className="w-full md:w-1/2 relative"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="absolute top-10 -left-10 w-full h-full border-2 border-gold-400/30 rounded-lg"></div>
                            <img
                                src={ASSETS.HOME_INTERIOR}
                                alt="Modern Interior"
                                className="w-full h-[600px] object-cover rounded-lg shadow-2xl relative z-10"
                            />
                            <div className="absolute -bottom-10 -right-10 bg-navy-900 p-8 rounded-lg shadow-xl z-20 border border-navy-700 max-w-xs hidden md:block">
                                <p className="font-serif text-2xl text-gold-400 mb-2">15 Years</p>
                                <p className="text-gray-400 text-sm">Of experience in luxury real estate market across the globe.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="w-full md:w-1/2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-gold-400 uppercase tracking-widest text-sm font-semibold mb-4 block">About Us</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-cream mb-8 leading-tight">We Redefine the <br /> Luxury Standards</h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                Our mission is to provide an unmatched experience in the world of high-end real estate. We don't just sell properties; we curate lifestyles. From penthouses in New York to villas in Tuscany, our portfolio is as diverse as it is exclusive.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center text-gray-300">
                                    <CheckCircle className="text-gold-400 mr-4" size={20} />
                                    Exclusive access to off-market listings
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <CheckCircle className="text-gold-400 mr-4" size={20} />
                                    Personalized concierge service
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <CheckCircle className="text-gold-400 mr-4" size={20} />
                                    Legal and financial consultancy included
                                </li>
                            </ul>
                            <Link to="/about" className="btn-primary">Learn More About Us</Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-24 bg-navy-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-gold-400 uppercase tracking-widest text-sm font-semibold mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-cream mb-6">Experience the Difference</h2>
                        <p className="text-gray-400">We bring expertise, passion, and personalized attention to every transaction.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={HomeIcon}
                            title="Premium Listings"
                            description="Access the most exclusive properties that are not available on the public market."
                        />
                        <FeatureCard
                            icon={Key}
                            title="Trusted Guidance"
                            description="Navigate the complex world of luxury real estate with our expert agents by your side."
                        />
                        <FeatureCard
                            icon={Star}
                            title="World Class Service"
                            description="From viewing to closing, experience a seamless and white-glove service."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={ASSETS.HOME_CTA_BG}
                        alt="Luxury Life"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy-900/90"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif text-cream mb-8">Ready to Find Your <span className="text-gold-400">Dreampad</span>?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        browse our complete catalog and find the one that speaks to you.
                    </p>
                    <Link to="/properties" className="btn-primary px-10 py-4 text-lg">Start Your Journey</Link>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
