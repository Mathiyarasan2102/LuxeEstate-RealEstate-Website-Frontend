import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubmitContactFormMutation } from '../store/contactApiSlice';
import toast from 'react-hot-toast';

const Contact = () => {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [submitContactForm, { isLoading, isSuccess, isError, error }] = useSubmitContactFormMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitContactForm(formData).unwrap();
            toast.success(result.message || 'Thank you for your message. We will get back to you shortly.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const contactItem = {
        initial: { opacity: 0, x: -30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const formField = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <Layout>
            <section className="pt-20 pb-10 bg-navy-900">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-5xl font-serif text-cream mb-4"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-400 max-w-xl mx-auto"
                    >
                        Have a question about a property or want to list with us? Our team is ready to assist you.
                    </motion.p>
                </div>
            </section>

            <section className="py-20 bg-navy-900">
                <div className="w-full px-2 sm:px-4 lg:container lg:mx-auto lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 min-w-0">
                        {/* Contact Info */}
                        <motion.div
                            className="flex flex-col gap-8 h-full min-w-0"
                            {...fadeInLeft}
                            initial={fadeInLeft.initial}
                            whileInView={fadeInLeft.animate}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.div
                                className="bg-navy-800 p-8 rounded-lg border border-navy-700"
                                whileHover={{ borderColor: '#fbbf24', transition: { duration: 0.3 } }}
                            >
                                <motion.h3
                                    className="text-xl font-serif text-cream mb-6"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    Get in Touch
                                </motion.h3>
                                <motion.div
                                    className="space-y-6"
                                    variants={staggerContainer}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    <motion.div
                                        className="flex items-start"
                                        variants={contactItem}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MapPin className="text-gold-400 mt-1 mr-4" size={24} />
                                        </motion.div>
                                        <div>
                                            <h4 className="text-white font-medium">Headquarters</h4>
                                            <p className="text-gray-400">123 Luxury Lane, Beverly Hills<br />CA 90210, USA</p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center"
                                        variants={contactItem}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Phone className="text-gold-400 mr-4" size={24} />
                                        </motion.div>
                                        <div>
                                            <h4 className="text-white font-medium">Phone</h4>
                                            <p className="text-gray-400">+1 (555) 123-4567</p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center"
                                        variants={contactItem}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Mail className="text-gold-400 mr-4" size={24} />
                                        </motion.div>
                                        <div>
                                            <h4 className="text-white font-medium">Email</h4>
                                            <p className="text-gray-400">contact@luxeestate.com</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Why Choose Us - Statistics */}
                            <motion.div
                                className="bg-navy-800 rounded-lg border border-navy-700 overflow-hidden p-6 flex-1 flex flex-col justify-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                viewport={{ once: true }}
                                whileHover={{ borderColor: '#fbbf24', transition: { duration: 0.3 } }}
                            >
                                <motion.h3
                                    className="text-xl font-serif text-cream mb-6 text-center"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    Why Choose LuxeEstate
                                </motion.h3>

                                <motion.div
                                    className="grid grid-cols-2 gap-4"
                                    variants={staggerContainer}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    <motion.div
                                        className="text-center p-4 bg-navy-900 rounded-lg border border-navy-700 hover:border-gold-400 transition-colors"
                                        variants={contactItem}
                                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                    >
                                        <motion.div
                                            className="text-3xl font-bold text-gold-400 mb-1"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            viewport={{ once: true }}
                                        >
                                            200+
                                        </motion.div>
                                        <div className="text-sm text-gray-400">Luxury Properties</div>
                                    </motion.div>

                                    <motion.div
                                        className="text-center p-4 bg-navy-900 rounded-lg border border-navy-700 hover:border-gold-400 transition-colors"
                                        variants={contactItem}
                                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                    >
                                        <motion.div
                                            className="text-3xl font-bold text-gold-400 mb-1"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            viewport={{ once: true }}
                                        >
                                            ₹2B+
                                        </motion.div>
                                        <div className="text-sm text-gray-400">Properties Sold</div>
                                    </motion.div>

                                    <motion.div
                                        className="text-center p-4 bg-navy-900 rounded-lg border border-navy-700 hover:border-gold-400 transition-colors"
                                        variants={contactItem}
                                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                    >
                                        <motion.div
                                            className="text-3xl font-bold text-gold-400 mb-1"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                            viewport={{ once: true }}
                                        >
                                            50+
                                        </motion.div>
                                        <div className="text-sm text-gray-400">Exclusive Listings</div>
                                    </motion.div>

                                    <motion.div
                                        className="text-center p-4 bg-navy-900 rounded-lg border border-navy-700 hover:border-gold-400 transition-colors"
                                        variants={contactItem}
                                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                    >
                                        <motion.div
                                            className="text-3xl font-bold text-gold-400 mb-1"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.7 }}
                                            viewport={{ once: true }}
                                        >
                                            15+
                                        </motion.div>
                                        <div className="text-sm text-gray-400">Premium Locations</div>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    className="mt-6 pt-6 border-t border-navy-700 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <p className="text-gray-400 text-sm mb-3">Trusted by leading investors worldwide</p>
                                    <div className="flex justify-center gap-2">
                                        <motion.div
                                            className="px-3 py-1 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-xs"
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                                        >
                                            Award Winning
                                        </motion.div>
                                        <motion.div
                                            className="px-3 py-1 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-xs"
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                                        >
                                            Licensed & Insured
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Form */}
                        <motion.div
                            className="bg-navy-800 p-8 rounded-lg border border-navy-700"
                            {...fadeInRight}
                            initial={fadeInRight.initial}
                            whileInView={fadeInRight.animate}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ borderColor: '#fbbf24', transition: { duration: 0.3 } }}
                        >
                            <motion.h3
                                className="text-xl font-serif text-cream mb-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Send us a Message
                            </motion.h3>
                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                variants={staggerContainer}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                            >
                                <motion.div variants={formField}>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <motion.input
                                        type="text"
                                        className={`input-field ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        required
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        whileFocus={{ scale: 1.01, borderColor: '#fbbf24' }}
                                        transition={{ duration: 0.2 }}
                                        readOnly={!!user}
                                    />
                                </motion.div>
                                <motion.div variants={formField}>
                                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                    <motion.input
                                        type="email"
                                        className={`input-field ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        required
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        whileFocus={{ scale: 1.01, borderColor: '#fbbf24' }}
                                        transition={{ duration: 0.2 }}
                                        readOnly={!!user}
                                    />
                                </motion.div>
                                <motion.div variants={formField}>
                                    <label className="block text-sm text-gray-400 mb-1">Subject</label>
                                    <motion.input
                                        type="text"
                                        className="input-field"
                                        required
                                        placeholder="Enter the subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        whileFocus={{ scale: 1.01, borderColor: '#fbbf24' }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>
                                <motion.div variants={formField}>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <motion.textarea
                                        rows="5"
                                        className="input-field"
                                        required
                                        placeholder="Enter your message here..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        whileFocus={{ scale: 1.01, borderColor: '#fbbf24' }}
                                        transition={{ duration: 0.2 }}
                                    ></motion.textarea>
                                </motion.div>
                                <motion.button
                                    type="submit"
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                    variants={formField}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isLoading ? 'Sending...' : 'Send Message'} <Send size={18} />
                                </motion.button>

                                <motion.div
                                    variants={formField}
                                    className="mt-8 pt-6 border-t border-navy-700"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-4 text-cream font-medium">
                                        <Clock size={18} className="text-gold-400" />
                                        <span>Office Hours</span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <div className="flex justify-between items-center border-b border-navy-700/50 pb-2">
                                            <span className="whitespace-nowrap">Monday - Friday</span>
                                            <span className="text-white whitespace-nowrap ml-4">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-navy-700/50 pb-2">
                                            <span className="whitespace-nowrap">Saturday</span>
                                            <span className="text-white whitespace-nowrap ml-4">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="whitespace-nowrap">Sunday</span>
                                            <span className="text-gold-400 whitespace-nowrap ml-4">Closed</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;

