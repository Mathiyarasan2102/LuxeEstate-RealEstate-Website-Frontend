import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Trophy, Globe } from 'lucide-react';

import { useGetAboutDataQuery } from '../store/aboutApiSlice';
import { ASSETS } from '../utils/assets';
import { AboutSkeleton } from '../components/ui/Skeletons';

const About = () => {
    const { data: aboutData, isLoading, error } = useGetAboutDataQuery();

    if (isLoading) {
        return (
            <Layout>
                <AboutSkeleton />
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-red-500 text-xl">Error loading page data</div>
                </div>
            </Layout>
        );
    }

    const { companyInfo, statistics, teamMembers, values } = aboutData || {};
    // Smooth animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -80 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 80 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const statItem = {
        initial: { opacity: 0, y: 30, scale: 0.9 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <Layout>
            {/* Hero */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-navy-900">
                    <motion.img
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.3 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        src={ASSETS.ABOUT_HERO_BG}
                        alt="About Us"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl font-serif text-cream mb-4"
                    >
                        About <span className="text-gold-400">LuxeEstate</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Defining the future of luxury real estate with unparalleled service and expertise.
                    </motion.p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-navy-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            {...fadeInLeft}
                            initial={fadeInLeft.initial}
                            whileInView={fadeInLeft.animate}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-serif text-cream mb-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Our Story
                            </motion.h2>
                            <motion.p
                                className="text-gray-400 mb-4 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                Founded in 2010, LuxeEstate began with a simple mission: to connect discerning clients with the world's most extraordinary properties. what started as a boutique agency in Beverly Hills has grown into a global network of luxury real estate experts.
                            </motion.p>
                            <motion.p
                                className="text-gray-400 mb-6 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                We believe that a home is more than just a place to live—it's an expression of who you are. That's why we go beyond the transaction to understand the unique lifestyle needs of each client.
                            </motion.p>
                        </motion.div>
                        <motion.div
                            {...fadeInRight}
                            initial={fadeInRight.initial}
                            whileInView={fadeInRight.animate}
                            viewport={{ once: true, margin: "-100px" }}
                            className="relative h-[400px] rounded-lg overflow-hidden border border-navy-700"
                        >
                            <motion.img
                                initial={{ scale: 1.3 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                viewport={{ once: true }}
                                src={ASSETS.ABOUT_OFFICE}
                                alt="Our Office"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-navy-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <motion.div variants={statItem}>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Globe className="mx-auto text-gold-400 mb-4" size={32} />
                            </motion.div>
                            <motion.div
                                className="text-3xl font-bold text-cream mb-1"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                {statistics?.yearsExperience || 15}+
                            </motion.div>
                            <div className="text-sm text-gray-400">Countries</div>
                        </motion.div>
                        <motion.div variants={statItem}>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Users className="mx-auto text-gold-400 mb-4" size={32} />
                            </motion.div>
                            <motion.div
                                className="text-3xl font-bold text-cream mb-1"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                {statistics?.happyClients?.toLocaleString() || '1,000'}+
                            </motion.div>
                            <div className="text-sm text-gray-400">Happy Clients</div>
                        </motion.div>
                        <motion.div variants={statItem}>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CheckCircle className="mx-auto text-gold-400 mb-4" size={32} />
                            </motion.div>
                            <motion.div
                                className="text-3xl font-bold text-cream mb-1"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                {statistics?.propertiesSold || 500}+
                            </motion.div>
                            <div className="text-sm text-gray-400">Properties Sold</div>
                        </motion.div>
                        <motion.div variants={statItem}>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Trophy className="mx-auto text-gold-400 mb-4" size={32} />
                            </motion.div>
                            <motion.div
                                className="text-3xl font-bold text-cream mb-1"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {statistics?.awards || 25}
                            </motion.div>
                            <div className="text-sm text-gray-400">Awards Won</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default About;

