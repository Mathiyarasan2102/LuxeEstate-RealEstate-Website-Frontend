import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg relative overflow-hidden"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-sm font-medium mb-1 break-words">{title}</p>
                    <h3 className="text-3xl font-bold text-cream">{value}</h3>
                </div>
                {Icon && (
                    <div className="p-3 bg-navy-700 rounded-lg text-gold-400 flex-shrink-0">
                        <Icon size={24} />
                    </div>
                )}
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="text-gray-500 ml-2">from last month</span>
                </div>
            )}

            {/* Background Decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-400/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
    );
};

export default StatsCard;
