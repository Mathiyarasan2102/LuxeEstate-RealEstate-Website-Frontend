import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader } from 'lucide-react';
import { useUploadImagesMutation } from '../../store/propertiesApiSlice';

const ImageUploader = ({ onImagesChange, initialImages = [], maxFiles = 10 }) => {
    const [images, setImages] = useState(initialImages);
    const [uploadImages, { isLoading }] = useUploadImagesMutation();
    const [uploadError, setUploadError] = useState(null);
    const imagesRef = useRef(images);

    // Keep ref in sync with state
    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    // Initialize state from props
    useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setUploadError(null);

        // Create local previews immediately for better UX
        const previewUrls = acceptedFiles.map(file => URL.createObjectURL(file));

        // Update local state with previews immediately
        // We use the ref to ensure we're adding to the latest list
        const currentImagesWithPreviews = [...imagesRef.current, ...previewUrls];
        setImages(currentImagesWithPreviews);

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const res = await uploadImages(formData).unwrap();

            // Replace previews with real URLs
            // Use ref to get latest state in case user deleted something while uploading
            const currentImages = imagesRef.current;
            const currentWithoutPreviews = currentImages.filter(url => !previewUrls.includes(url));
            const finalImages = [...currentWithoutPreviews, ...res.urls];

            // Update local state
            setImages(finalImages);

            // Update parent state in a separate event loop tick or just sequentially
            // Since this runs after await, it's safe to call prop updates here
            onImagesChange(finalImages);

        } catch (err) {
            console.error('Upload failed', err);
            setUploadError(err?.data?.message || 'Failed to upload images. Please try again.');

            // Remove previews on error
            const currentImages = imagesRef.current;
            const cleanupImages = currentImages.filter(url => !previewUrls.includes(url));
            setImages(cleanupImages);
        }
    }, [uploadImages, onImagesChange]);

    const removeImage = (indexToRemove) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
        onImagesChange(newImages);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: true,
        maxFiles: maxFiles - images.length,
        disabled: isLoading || images.length >= maxFiles
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 
                    ${isDragActive ? 'border-gold-400 bg-navy-800/50' : 'border-navy-600 hover:border-gold-400 hover:bg-navy-800/30'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-gray-400">
                    {isLoading ? (
                        <Loader className="w-10 h-10 animate-spin text-gold-400 mb-2" />
                    ) : (
                        <Upload className={`w-10 h-10 mb-2 ${isDragActive ? 'text-gold-400' : 'text-gray-500'}`} />
                    )}
                    {isDragActive ? (
                        <p className="text-gold-400">Drop the images here...</p>
                    ) : (
                        <p>Drag & drop images here, or click to select</p>
                    )}
                    <p className="text-xs mt-2 text-gray-500">
                        Supports JPG, PNG, WEBP (Max 5MB)
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="text-red-500 text-sm text-center">{uploadError}</div>
            )}

            {/* Image Grid */}
            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
                    >
                        {images.map((url, index) => (
                            <motion.div
                                key={url + index} // simple unique key for mixed local/remote URLs
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="relative group aspect-square rounded-lg overflow-hidden bg-navy-800 border border-navy-700"
                            >
                                <img
                                    src={url}
                                    alt={`Uploaded ${index}`}
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/400x400/1e293b/fbbf24?text=Image+Error';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-gold-400/90 text-navy-950 text-xs font-bold rounded">
                                        Cover
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUploader;
