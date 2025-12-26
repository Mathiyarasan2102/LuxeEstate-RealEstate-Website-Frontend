import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import AuthPage from '../pages/AuthPage';
import Properties from '../pages/Properties';
import PropertyDetail from '../pages/PropertyDetail';
import Dashboard from '../pages/Dashboard';
import SellerDashboard from '../pages/SellerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AddProperty from '../pages/AddProperty';
import EditProperty from '../pages/EditProperty';
import PrivateRoute from '../components/PrivateRoute';
import NotFound from '../pages/NotFound';

const RoleBasedHome = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (!user) return children;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'agent') return <Navigate to="/seller/dashboard" replace />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes - Home redirects Agents/Admins to their Dashboards */}
            <Route path="/" element={<RoleBasedHome><Home /></RoleBasedHome>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes with Flip Animation - using dynamic param to prevent unmount */}
            <Route path="/:authMode" element={<AuthPage />} />

            {/* Property Routes */}
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />

            {/* Private User Routes - Only for 'user' role */}
            <Route element={<PrivateRoute allowedRoles={['user']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Seller Dashboard - Accessible for Users (to apply), Agents, and Admins */}
            <Route element={<PrivateRoute allowedRoles={['user', 'agent', 'admin']} />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
            </Route>

            {/* Seller Actions - Strictly Agent & Admin */}
            <Route element={<PrivateRoute allowedRoles={['agent', 'admin']} />}>
                <Route path="/seller/add-property" element={<AddProperty />} />
                <Route path="/seller/edit-property/:id" element={<EditProperty />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* 404 Not Found - Must be the last route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
