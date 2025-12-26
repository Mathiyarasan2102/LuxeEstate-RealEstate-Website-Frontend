import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetPropertyQuery, useUpdatePropertyMutation } from '../store/propertiesApiSlice';
import PropertyForm from '../components/Seller/PropertyForm';
import AnimatedPage from '../components/ui/AnimatedPage';
import { ArrowLeft, Loader } from 'lucide-react';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch existing data
    const { data: property, isLoading: isFetching, error } = useGetPropertyQuery(id);
    const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();

    useEffect(() => {
        if (error) {
            toast.error('Could not load property details');
            navigate('/seller/dashboard');
        }
    }, [error, navigate]);

    const handleSubmit = async (formData) => {
        try {
            await updateProperty({ id, ...formData }).unwrap();
            toast.success('Property updated successfully!');
            navigate('/seller/dashboard');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update property');
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-screen bg-navy-950">
                <Loader className="animate-spin text-gold-400 w-12 h-12" />
            </div>
        );
    }

    return (
        <AnimatedPage className="container mx-auto px-4 py-8 max-w-5xl">
            <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex items-center text-gray-400 hover:text-gold-400 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-serif text-cream mb-2">Edit Listing</h1>
                <p className="text-gray-400">Update the details of your property.</p>
                {property?.approvalStatus === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200">
                        <strong>Rejection Reason:</strong> {property.adminNote}
                    </div>
                )}
            </div>

            <PropertyForm
                initialData={property}
                onSubmit={handleSubmit}
                isLoading={isUpdating}
                isEditMode={true}
            />
        </AnimatedPage>
    );
};

export default EditProperty;
