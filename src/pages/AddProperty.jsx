import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCreatePropertyMutation } from '../store/propertiesApiSlice';
import PropertyForm from '../components/Seller/PropertyForm';
import AnimatedPage from '../components/ui/AnimatedPage';
import { ArrowLeft } from 'lucide-react';

const AddProperty = () => {
    const navigate = useNavigate();
    const [createProperty, { isLoading }] = useCreatePropertyMutation();

    const handleSubmit = async (formData) => {
        try {
            await createProperty(formData).unwrap();
            toast.success('Property created successfully! Pending admin approval.');
            navigate('/seller/dashboard');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create property');
        }
    };

    return (
        <AnimatedPage className="container mx-auto px-4 py-8 max-w-5xl">
            <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex items-center text-gray-400 hover:text-gold-400 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-serif text-cream mb-2">Add New Property</h1>
                <p className="text-gray-400">Fill in the details below to create a new property listing.</p>
            </div>

            <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </AnimatedPage>
    );
};

export default AddProperty;
