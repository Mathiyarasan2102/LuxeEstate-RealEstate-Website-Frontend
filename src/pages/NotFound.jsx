import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center relative overflow-hidden text-center">
            {/* Background ambient effects */}
            <div className="absolute inset-0 bg-navy-900 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                >
                    <h1 className="text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-200 font-bold opacity-20 select-none">
                        404
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-serif text-cream font-bold drop-shadow-lg -mt-16 relative z-10">
                        Page Not Found
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <Link to="/" className="btn-primary flex items-center gap-2 group">
                        <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                        Return Home
                    </Link>
                    <Link to="/properties" className="btn-outline flex items-center gap-2 group">
                        <Search size={20} className="group-hover:scale-110 transition-transform" />
                        Browse Properties
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
