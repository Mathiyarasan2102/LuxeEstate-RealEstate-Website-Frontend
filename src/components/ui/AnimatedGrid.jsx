import React from 'react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
};

export const AnimatedGrid = ({ children, className = '' }) => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const AnimatedItem = ({ children, className = '' }) => {
    return (
        <motion.div variants={item} className={className}>
            {children}
        </motion.div>
    );
};
