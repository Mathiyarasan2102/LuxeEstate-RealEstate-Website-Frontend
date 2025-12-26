import React, { useState, useEffect } from 'react';
import { useGetPropertiesQuery } from '../store/propertiesApiSlice';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/properties/PropertyCard';
import { PropertyCardSkeleton } from '../components/ui/Skeletons';
import { Search, Filter } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

const Properties = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params to persist state on refresh
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [type, setType] = useState(searchParams.get('type') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'Any Price');

    // Parse page from URL, default to 1
    const initialPage = parseInt(searchParams.get('page')) || 1;
    const [page, setPage] = useState(initialPage);

    const getPriceConstraints = (range) => {
        switch (range) {
            case '₹50L - ₹1Cr': return { minPrice: 5000000, maxPrice: 10000000 };
            case '₹1Cr - ₹5Cr': return { minPrice: 10000000, maxPrice: 50000000 };
            case '₹5Cr+': return { minPrice: 50000000 };
            default: return {};
        }
    };

    const { minPrice, maxPrice } = getPriceConstraints(priceRange);

    const { data, isLoading, error } = useGetPropertiesQuery({
        city: search,
        type: type === 'All' ? '' : type,
        minPrice,
        maxPrice,
        page
    });

    // Sync state to URL params whenever filters or page changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (type && type !== 'All') params.set('type', type);
        if (priceRange && priceRange !== 'Any Price') params.set('price', priceRange);
        if (page > 1) params.set('page', page.toString());

        setSearchParams(params, { replace: true });
    }, [search, type, priceRange, page, setSearchParams]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    // Handlers for filters (reset page to 1 when filters change)
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setPage(1);
    };

    const handlePriceChange = (e) => {
        setPriceRange(e.target.value);
        setPage(1);
    };

    const propertyTypes = ['All', 'House', 'Apartment', 'Condo', 'Villa', 'Commercial', 'Land'];
    const priceRanges = ['Any Price', '₹50L - ₹1Cr', '₹1Cr - ₹5Cr', '₹5Cr+'];

    return (
        <Layout>
            <div className="bg-navy-800 py-12 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-serif text-cream text-center mb-4">Our Exclusive Collection</h1>
                    <p className="text-gray-400 text-center max-w-2xl mx-auto">Find your dream home among our curated list of premium properties.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mb-16">
                {/* Filters */}
                <div className="bg-navy-800 p-6 rounded-lg mb-8 border border-navy-700 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search Location"
                                className="w-full bg-navy-900 border border-navy-600 rounded pl-10 pr-4 py-2 text-cream focus:outline-none focus:border-gold-400"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <select
                                className="w-full md:w-48 bg-navy-900 border border-navy-600 rounded px-4 py-2 text-cream focus:outline-none focus:border-gold-400"
                                value={type}
                                onChange={handleTypeChange}
                            >
                                <option value="" disabled>Property Type</option>
                                {propertyTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-shrink-0">
                            <select
                                className="w-full md:w-48 bg-navy-900 border border-navy-600 rounded px-4 py-2 text-cream focus:outline-none focus:border-gold-400"
                                value={priceRange}
                                onChange={handlePriceChange}
                            >
                                {priceRanges.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <PropertyCardSkeleton key={n} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">Error loading properties</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data?.properties?.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>

                        {data?.properties?.length === 0 && (
                            <div className="text-center py-20 text-gray-400">No properties found matching your criteria.</div>
                        )}

                        {/* Pagination */}
                        {data?.pages > 1 && data?.properties?.length > 0 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-navy-800 text-cream rounded disabled:opacity-50 hover:bg-navy-700 transition"
                                >
                                    Previous
                                </button>

                                {[...Array(data.pages).keys()].map(x => (
                                    <button
                                        key={x + 1}
                                        onClick={() => setPage(x + 1)}
                                        className={`px-4 py-2 rounded transition ${page === x + 1 ? 'bg-gold-400 text-navy-900 font-bold' : 'bg-navy-800 text-cream hover:bg-navy-700'}`}
                                    >
                                        {x + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                                    disabled={page === data.pages}
                                    className="px-4 py-2 bg-navy-800 text-cream rounded disabled:opacity-50 hover:bg-navy-700 transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Properties;
