import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-navy-900 border-t border-navy-800 pt-20 pb-10 text-gray-400 font-sans relative overflow-hidden">
            {/* Background Pattern or Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section - Full width on mobile, 1 column on desktop */}
                    <div className="space-y-6 lg:col-span-1">
                        <Link to="/" className="block">
                            <h2 className="text-3xl font-serif font-bold text-cream tracking-tight">
                                Luxe<span className="text-gold-400">Estate</span>
                            </h2>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                            Redefining the standard of luxury living. We provide exclusive access to the world's most prestigious properties, ensuring a lifestyle that is nothing short of extraordinary.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon Icon={Facebook} />
                            <SocialIcon Icon={Twitter} />
                            <SocialIcon Icon={Instagram} />
                            <SocialIcon Icon={Linkedin} />
                        </div>
                    </div>

                    {/* Explore and Services - Side by side on mobile, separate columns on desktop */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:gap-12">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-serif font-semibold text-lg mb-6">Explore</h3>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to="/" label="Home" />
                                <FooterLink to="/properties" label="Properties" />
                                <FooterLink to="/about" label="About Us" />
                                <FooterLink to="/about" label="Our Agents" />
                                <FooterLink to="/contact" label="Contact" />
                            </ul>
                        </div>

                        {/* Services/Support */}
                        <div>
                            <h3 className="text-white font-serif font-semibold text-lg mb-6">Services</h3>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to="/properties" label="Buy a Home" />
                                <FooterLink to="/contact" label="Sell Your Home" />
                                <FooterLink to="/properties" label="Rent a Home" />
                                <FooterLink to="/contact" label="Property Valuation" />
                                <FooterLink to="/contact" label="Legal Consultancy" />
                            </ul>
                        </div>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="lg:col-span-1">
                        <h3 className="text-white font-serif font-semibold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm mb-8">
                            <li className="flex items-start">
                                <MapPin size={18} className="text-gold-400 mr-3 mt-1 flex-shrink-0" />
                                <span>123 Luxury Blvd, Beverly Hills,<br />CA 90210, USA</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="text-gold-400 mr-3 flex-shrink-0" />
                                <span>+1 (800) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="text-gold-400 mr-3 flex-shrink-0" />
                                <span>concierge@luxeestate.com</span>
                            </li>
                        </ul>


                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} LuxeEstate. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-gold-400 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, label }) => (
    <li>
        <Link to={to} className="hover:text-gold-400 transition-all duration-300 flex items-center group">
            <span className="w-0 group-hover:w-2 h-px bg-gold-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
            {label}
        </Link>
    </li>
);

const SocialIcon = ({ Icon }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gold-400 hover:bg-gold-400 hover:text-navy-900 transition-all duration-300 transform hover:scale-110 border border-navy-700 hover:border-gold-400">
        <Icon size={18} />
    </a>
);

export default Footer;
